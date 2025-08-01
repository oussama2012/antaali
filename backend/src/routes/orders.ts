import express from 'express';
import { Order, OrderItem, Perfume, Store, User } from '../models';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { orderSchema, orderUpdateSchema } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { storeId, status, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (storeId) whereClause.storeId = storeId;
    if (status) whereClause.status = status;

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Perfume, as: 'perfume' }]
        },
        { model: Store, as: 'store' },
        { model: User, as: 'user' }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      orders: orders.rows,
      pagination: {
        total: orders.count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(orders.count / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Perfume, as: 'perfume' }]
        },
        { model: Store, as: 'store' },
        { model: User, as: 'user' }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', authenticateToken, validateRequest(orderSchema), async (req, res) => {
  try {
    const { storeId, notes, items } = req.body;
    const userId = (req as any).user.userId;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const perfume = await Perfume.findByPk(item.perfumeId);
      if (!perfume) {
        return res.status(400).json({ error: `Perfume with ID ${item.perfumeId} not found` });
      }
      
      let price = 0;
      switch (item.size) {
        case '30ml': price = perfume.price30ml; break;
        case '50ml': price = perfume.price50ml; break;
        case '100ml': price = perfume.price100ml; break;
        default: return res.status(400).json({ error: 'Invalid size' });
      }
      
      totalAmount += price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      orderNumber: `ORD-${Date.now()}`,
      storeId,
      userId,
      totalAmount,
      status: 'pending',
      notes,
      orderDate: new Date()
    });

    // Create order items
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const perfume = await Perfume.findByPk(item.perfumeId);
        let unitPrice = 0;
        switch (item.size) {
          case '30ml': unitPrice = perfume?.price30ml || 0; break;
          case '50ml': unitPrice = perfume?.price50ml || 0; break;
          case '100ml': unitPrice = perfume?.price100ml || 0; break;
        }
        const totalPrice = unitPrice * item.quantity;
        
        return OrderItem.create({
          orderId: order.id,
          perfumeId: item.perfumeId,
          size: item.size,
          quantity: item.quantity,
          unitPrice,
          totalPrice
        });
      })
    );

    // Fetch complete order with relations
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Perfume, as: 'perfume' }]
        },
        { model: Store, as: 'store' },
        { model: User, as: 'user' }
      ]
    });

    logger.info(`Order created: ${order.id} by user ${userId}`);
    res.status(201).json(completeOrder);
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.patch('/:id', authenticateToken, validateRequest(orderUpdateSchema), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.update({ status, notes });

    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Perfume, as: 'perfume' }]
        },
        { model: Store, as: 'store' },
        { model: User, as: 'user' }
      ]
    });

    logger.info(`Order ${order.id} status updated to ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    logger.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete order items first
    await OrderItem.destroy({ where: { orderId: order.id } });
    
    // Delete order
    await order.destroy();

    logger.info(`Order deleted: ${order.id}`);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    logger.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
