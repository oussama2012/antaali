import React, { useState } from 'react';
import Layout from '../Layout';
import { 
  ShoppingCart, 
  Plus, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck,
  Minus,
  X
} from 'lucide-react';
import { mockPerfumes } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { OrderItem, Order } from '../../types';
import { orderService } from '../../services/orderService';
import { inventoryService } from '../../services/inventoryService';

const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'orders' | 'new-order' | 'track'>('orders');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedPerfume, setSelectedPerfume] = useState('');
  const [selectedSize, setSelectedSize] = useState<'30ml' | '50ml' | '100ml'>('30ml');
  const [quantity, setQuantity] = useState(1);

  // فلترة الطلبات الخاصة بالمحل
  const [orders, setOrders] = useState<Order[]>([]);
  
  React.useEffect(() => {
    if (user?.shopId) {
      setOrders(orderService.getOrdersByShop(user.shopId));
    }
  }, [user?.shopId]);

  const addToCart = () => {
    if (!selectedPerfume) return;

    const existingItem = cart.find(item => 
      item.perfumeId === selectedPerfume && item.size === selectedSize
    );

    if (existingItem) {
      setCart(prev => prev.map(item =>
        item.perfumeId === selectedPerfume && item.size === selectedSize
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const perfume = mockPerfumes.find(p => p.id === selectedPerfume);
      setCart(prev => [...prev, {
        perfumeId: selectedPerfume,
        size: selectedSize,
        quantity,
        perfumeName: perfume?.name
      }]);
    }

    setSelectedPerfume('');
    setQuantity(1);
  };

  const removeFromCart = (perfumeId: string, size: string) => {
    setCart(prev => prev.filter(item => 
      !(item.perfumeId === perfumeId && item.size === size)
    ));
  };

  const updateCartQuantity = (perfumeId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(perfumeId, size);
      return;
    }

    setCart(prev => prev.map(item =>
      item.perfumeId === perfumeId && item.size === size
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const submitOrder = () => {
    if (cart.length === 0) return;
    if (!user?.shopId) return;

    const result = orderService.createOrder(user.shopId, user.name || 'محل غير معروف', cart);
    
    if (result.success) {
      alert('تم إرسال الطلب بنجاح! سيتم مراجعته من قبل المصنع.');
      setCart([]);
      setCurrentView('orders');
      // تحديث قائمة الطلبات
      setOrders(orderService.getOrdersByShop(user.shopId));
    } else {
      const errorMessage = result.errors?.join('\n') || 'حدث خطأ في إرسال الطلب';
      alert(`فشل في إرسال الطلب:\n${errorMessage}`);
    }
  };

  const getAvailableStock = (perfumeId: string, size: string) => {
    return inventoryService.getAvailableQuantity(perfumeId, size);
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'preparing': return 'قيد التحضير';
      case 'delivered': return 'تم التوصيل';
      default: return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Layout title="لوحة تحكم المحل">
      <div className="space-y-6">
        {/* Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:flex sm:space-x-4 sm:space-x-reverse">
            {[
              { id: 'orders', label: 'طلباتي', icon: ShoppingCart },
              { id: 'new-order', label: 'طلب جديد', icon: Plus },
              { id: 'track', label: 'تتبع الطلبات', icon: Package }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as 'orders' | 'new-order' | 'track')}
                  className={`flex items-center justify-center sm:justify-start space-x-2 space-x-reverse px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    currentView === tab.id
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {currentView === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">طلباتي الأخيرة</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد طلبات حتى الآن
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="font-medium text-gray-800">طلب #{order.id}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="mr-1">{getStatusLabel(order.status)}</span>
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ar')}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {item.perfumeName} ({item.size})
                          </span>
                          <span className="font-medium">{item.quantity} قطعة</span>
                        </div>
                      ))}
                    </div>
                    
                    {order.deliveryNote && (
                      <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                        {order.deliveryNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'new-order' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">إضافة منتج</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العطر</label>
                  <select
                    value={selectedPerfume}
                    onChange={(e) => setSelectedPerfume(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">اختر العطر</option>
                    {mockPerfumes.map((perfume) => (
                      <option key={perfume.id} value={perfume.id}>
                        {perfume.name} - {perfume.brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحجم</label>
                  <div className="flex space-x-3 space-x-reverse">
                    {(['30ml', '50ml', '100ml'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedSize === size
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPerfume && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">
                      الكمية المتوفرة: {getAvailableStock(selectedPerfume, selectedSize)} قطعة
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  disabled={!selectedPerfume}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  إضافة إلى الطلب
                </button>
              </div>
            </div>

            {/* Cart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">الطلب الحالي</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لا توجد منتجات في الطلب
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.perfumeName}</p>
                        <p className="text-sm text-gray-600">الحجم: {item.size}</p>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => updateCartQuantity(item.perfumeId, item.size, item.quantity - 1)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.perfumeId, item.size, item.quantity + 1)}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.perfumeId, item.size)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-800">إجمالي القطع:</span>
                      <span className="font-bold text-amber-600">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                      </span>
                    </div>
                    
                    <button
                      onClick={submitOrder}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      إرسال الطلب
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'track' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">تتبع الطلبات</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { status: 'pending', label: 'قيد الانتظار', color: 'yellow', icon: Clock },
                { status: 'preparing', label: 'قيد التحضير', color: 'blue', icon: Truck },
                { status: 'delivered', label: 'تم التوصيل', color: 'green', icon: CheckCircle }
              ].map((statusInfo) => {
                const Icon = statusInfo.icon;
                const statusOrders = orders.filter((order: Order) => order.status === statusInfo.status);
                
                return (
                  <div key={statusInfo.status} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 space-x-reverse mb-4">
                      <Icon className={`w-6 h-6 text-${statusInfo.color}-600`} />
                      <h3 className="font-medium text-gray-800">{statusInfo.label}</h3>
                      <span className={`px-2 py-1 bg-${statusInfo.color}-100 text-${statusInfo.color}-800 rounded-full text-sm font-medium`}>
                        {statusOrders.length}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {statusOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">طلب #{order.id}</span>
                            <span className="text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('ar')}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {statusOrders.length > 3 && (
                        <div className="text-xs text-gray-500">
                          و {statusOrders.length - 3} طلبات أخرى...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShopDashboard;