import React, { useState } from 'react';
import { ShoppingCart, Eye, Truck, CheckCircle, Clock, FileText } from 'lucide-react';
import { mockOrders, mockPerfumes } from '../../data/mockData';
import { Order } from '../../types';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'delivered'>('all');

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const getPerfumeName = (perfumeId: string) => {
    return mockPerfumes.find(p => p.id === perfumeId)?.name || 'غير معروف';
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

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const generateDeliveryNote = (order: Order) => {
    // في التطبيق الحقيقي، هذا سيولد PDF
    const content = `
بون التوصيل - Antaali

رقم الطلب: ${order.id}
المحل: ${order.shopName}
التاريخ: ${new Date(order.updatedAt).toLocaleDateString('ar')}

المنتجات:
${order.items.map(item => 
  `- ${getPerfumeName(item.perfumeId)} (${item.size}) × ${item.quantity}`
).join('\n')}

تم التوصيل بنجاح
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-note-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <ShoppingCart className="w-6 h-6 text-amber-600 ml-2" />
            إدارة الطلبات
          </h2>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-4 space-x-reverse mb-6">
          {[
            { key: 'all', label: 'جميع الطلبات' },
            { key: 'pending', label: 'قيد الانتظار' },
            { key: 'preparing', label: 'قيد التحضير' },
            { key: 'delivered', label: 'تم التوصيل' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === filter.key
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-700">رقم الطلب</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">المحل</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">عدد المنتجات</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">تاريخ الطلب</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-800">#{order.id}</td>
                  <td className="py-4 px-4 text-gray-600">{order.shopName}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('ar')}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' && <Clock className="w-3 h-3 ml-1" />}
                      {order.status === 'preparing' && <Truck className="w-3 h-3 ml-1" />}
                      {order.status === 'delivered' && <CheckCircle className="w-3 h-3 ml-1" />}
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          بدء التحضير
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          تم التوصيل
                        </button>
                      )}
                      
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => generateDeliveryNote(order)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                          title="تحميل بون التوصيل"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد طلبات في هذه الفئة
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  تفاصيل الطلب #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المحل</label>
                    <p className="text-gray-900">{selectedOrder.shopName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الطلب</label>
                    <p className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString('ar')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">آخر تحديث</label>
                    <p className="text-gray-900">{new Date(selectedOrder.updatedAt).toLocaleString('ar')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">المنتجات المطلوبة</label>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{getPerfumeName(item.perfumeId)}</p>
                          <p className="text-sm text-gray-600">الحجم: {item.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{item.quantity} قطعة</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.deliveryNote && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات التوصيل</label>
                    <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{selectedOrder.deliveryNote}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-6 pt-6 border-t">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إغلاق
                </button>
                {selectedOrder.status === 'delivered' && (
                  <button
                    onClick={() => generateDeliveryNote(selectedOrder)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    تحميل بون التوصيل
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;