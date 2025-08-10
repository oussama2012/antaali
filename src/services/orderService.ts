import { Order, OrderItem } from '../types';
import { mockOrders } from '../data/mockData';
import { inventoryService } from './inventoryService';

const ORDERS_STORAGE_KEY = 'antaali_orders';

export class OrderService {
  private static instance: OrderService;
  private orders: Order[] = [];

  private constructor() {
    this.loadOrders();
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  private loadOrders(): void {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
    } else {
      this.orders = [...mockOrders];
      this.saveOrders();
    }
  }

  private saveOrders(): void {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
  }

  public getAllOrders(): Order[] {
    return [...this.orders];
  }

  public getOrdersByShop(shopId: string): Order[] {
    return this.orders.filter(order => order.shopId === shopId);
  }

  public getOrderById(orderId: string): Order | null {
    return this.orders.find(order => order.id === orderId) || null;
  }

  public createOrder(shopId: string, shopName: string, items: OrderItem[]): { success: boolean; orderId?: string; errors?: string[] } {
    if (items.length === 0) {
      return { success: false, errors: ['لا توجد منتجات في الطلب'] };
    }

    // Process inventory deduction
    const inventoryResult = inventoryService.processOrderItems(items);
    if (!inventoryResult.success) {
      return { success: false, errors: inventoryResult.errors };
    }

    // Create the order
    const newOrder: Order = {
      id: Date.now().toString(),
      shopId,
      shopName,
      items: [...items],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.push(newOrder);
    this.saveOrders();

    return { success: true, orderId: newOrder.id };
  }

  public updateOrderStatus(orderId: string, newStatus: Order['status'], deliveryNote?: string): boolean {
    const index = this.orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      this.orders[index].status = newStatus;
      this.orders[index].updatedAt = new Date().toISOString();
      if (deliveryNote) {
        this.orders[index].deliveryNote = deliveryNote;
      }
      this.saveOrders();
      return true;
    }
    return false;
  }

  public cancelOrder(orderId: string): boolean {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== 'pending') {
      return false; // Can only cancel pending orders
    }

    // Restore inventory
    inventoryService.restoreStock(order.items);

    // Remove order or mark as cancelled
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      this.orders.splice(index, 1);
      this.saveOrders();
      return true;
    }
    return false;
  }

  public getOrderStats(): {
    total: number;
    pending: number;
    preparing: number;
    delivered: number;
  } {
    return {
      total: this.orders.length,
      pending: this.orders.filter(o => o.status === 'pending').length,
      preparing: this.orders.filter(o => o.status === 'preparing').length,
      delivered: this.orders.filter(o => o.status === 'delivered').length
    };
  }
}

export const orderService = OrderService.getInstance();
