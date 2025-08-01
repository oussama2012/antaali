import React, { useState } from 'react';
import Layout from '../Layout';
import { 
  Factory, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { mockOrders, mockPerfumes } from '../../data/mockData';
import { Order } from '../../types';

const FactoryDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deliveryNote, setDeliveryNote] = useState('');

  const updateOrderStatus = (orderId: string, newStatus: Order['status'], note?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus, 
            updatedAt: new Date().toISOString(),
            deliveryNote: note || order.deliveryNote
          }
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

  const generateDeliveryNote = (order: Order) => {
    const content = `
بون التوصيل - Antaali Perfumes

رقم الطلب: ${order.id}
المحل: ${order.shopName}
التاريخ: ${new Date().toLocaleDateString('ar')}
الوقت: ${new Date().toLocaleTimeString('ar')}

المنتجات المسلمة:
${order.items.map(item => 
  `- ${getPerfumeName(item.perfumeId)} (${item.size}) × ${item.quantity} قطعة`
).join('\n')}

إجمالي القطع: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}

ملاحظات التوصيل:
${order.deliveryNote || 'تم التوصيل بنجاح'}

توقيع المستلم: ________________

شركة عطور Antaali
${new Date().getFullYear()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bon-livraison-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  return (
    <Layout title="لوحة تحكم المصنع">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">طلبات جديدة</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد التحضير</p>
                <p className="text-2xl font-bold text-blue-600">{preparingOrders.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تم التوصيل</p>
                <p className="text-2xl font-bold text-green-600">{deliveredOrders.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Pending Orders - Priority */}
        {pendingOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-800">طلبات تحتاج إلى معالجة</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {pendingOrders.length} طلب
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-800">طلب #{order.id}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('ar')}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">المحل: {order.shopName}</p>
                    <p className="text-sm text-gray-600">
                      المنتجات: {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                    </p>
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    بدء التحضير
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Orders Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <Factory className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-800">جميع الطلبات</h2>
          </div>

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
                {orders.map((order) => (
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
                          <Package className="w-4 h-4" />
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
                            onClick={() => {
                              setSelectedOrder(order);
                              setDeliveryNote('تم التوصيل بنجاح');
                            }}
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
                    onClick={() => {
                      setSelectedOrder(null);
                      setDeliveryNote('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Package className="w-6 h-6" />
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

                  {selectedOrder.status === 'preparing' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات التوصيل</label>
                      <textarea
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        rows={3}
                        placeholder="أدخل ملاحظات التوصيل..."
                      />
                    </div>
                  )}

                  {selectedOrder.deliveryNote && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات التوصيل</label>
                      <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{selectedOrder.deliveryNote}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setDeliveryNote('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    إغلاق
                  </button>
                  
                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'delivered', deliveryNote);
                        setSelectedOrder(null);
                        setDeliveryNote('');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      تأكيد التوصيل
                    </button>
                  )}
                  
                  {selectedOrder.status === 'delivered' && (
                    <button
                      onClick={() => generateDeliveryNote(selectedOrder)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    </Layout>
  );
};

export default FactoryDashboard;