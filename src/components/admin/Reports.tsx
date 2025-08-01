import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Package, Store, Calendar } from 'lucide-react';
import { mockOrders, mockPerfumes, mockShops } from '../../data/mockData';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<'sales' | 'orders' | 'delivery'>('sales');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-01-31' });

  // حساب العطور الأكثر مبيعاً
  const getTopSellingPerfumes = () => {
    const salesData: { [key: string]: number } = {};
    
    mockOrders.forEach(order => {
      order.items.forEach(item => {
        const key = `${item.perfumeId}-${item.size}`;
        salesData[key] = (salesData[key] || 0) + item.quantity;
      });
    });

    return Object.entries(salesData)
      .map(([key, quantity]) => {
        const [perfumeId, size] = key.split('-');
        const perfume = mockPerfumes.find(p => p.id === perfumeId);
        return {
          perfumeId,
          perfumeName: perfume?.name || 'غير معروف',
          size,
          totalSold: quantity
        };
      })
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);
  };

  // حساب الطلبات حسب المحل
  const getOrdersByShop = () => {
    const shopOrders: { [key: string]: number } = {};
    
    mockOrders.forEach(order => {
      shopOrders[order.shopId] = (shopOrders[order.shopId] || 0) + 1;
    });

    return Object.entries(shopOrders).map(([shopId, orderCount]) => {
      const shop = mockShops.find(s => s.id === shopId);
      return {
        shopId,
        shopName: shop?.name || 'غير معروف',
        orderCount
      };
    });
  };

  // سجل التوصيل
  const getDeliveryLog = () => {
    return mockOrders.filter(order => order.status === 'delivered');
  };

  const exportToPDF = (reportType: string) => {
    // في التطبيق الحقيقي، هذا سيولد PDF
    alert(`سيتم تصدير تقرير ${reportType} إلى PDF`);
  };

  const exportToExcel = (reportType: string) => {
    // في التطبيق الحقيقي، هذا سيولد Excel
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'sales':
        const salesData = getTopSellingPerfumes();
        csvContent = 'اسم العطر,الحجم,الكمية المباعة\n' +
          salesData.map(item => `${item.perfumeName},${item.size},${item.totalSold}`).join('\n');
        filename = 'top_selling_perfumes.csv';
        break;
      case 'orders':
        const ordersData = getOrdersByShop();
        csvContent = 'اسم المحل,عدد الطلبات\n' +
          ordersData.map(item => `${item.shopName},${item.orderCount}`).join('\n');
        filename = 'orders_by_shop.csv';
        break;
      case 'delivery':
        const deliveryData = getDeliveryLog();
        csvContent = 'رقم الطلب,المحل,تاريخ التوصيل\n' +
          deliveryData.map(order => `${order.id},${order.shopName},${new Date(order.updatedAt).toLocaleDateString('ar')}`).join('\n');
        filename = 'delivery_log.csv';
        break;
    }

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topSellingPerfumes = getTopSellingPerfumes();
  const ordersByShop = getOrdersByShop();
  const deliveryLog = getDeliveryLog();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <BarChart3 className="w-6 h-6 text-amber-600 ml-2" />
            التقارير والإحصائيات
          </h2>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">فترة التقرير:</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-500">إلى</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex space-x-4 space-x-reverse mb-6">
          {[
            { key: 'sales', label: 'العطور الأكثر مبيعاً', icon: TrendingUp },
            { key: 'orders', label: 'الطلبات حسب المحل', icon: Store },
            { key: 'delivery', label: 'سجل التوصيل', icon: Package }
          ].map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.key}
                onClick={() => setSelectedReport(report.key as any)}
                className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedReport === report.key
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{report.label}</span>
              </button>
            );
          })}
        </div>

        {/* Export Buttons */}
        <div className="flex space-x-3 space-x-reverse mb-6">
          <button
            onClick={() => exportToPDF(selectedReport)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير PDF</span>
          </button>
          <button
            onClick={() => exportToExcel(selectedReport)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير Excel</span>
          </button>
        </div>

        {/* Report Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          {selectedReport === 'sales' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">العطور الأكثر مبيعاً</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-2 px-4 font-medium text-gray-700">الترتيب</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">اسم العطر</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">الحجم</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">الكمية المباعة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingPerfumes.map((item, index) => (
                      <tr key={`${item.perfumeId}-${item.size}`} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-800">#{index + 1}</td>
                        <td className="py-3 px-4 text-gray-600">{item.perfumeName}</td>
                        <td className="py-3 px-4 text-gray-600">{item.size}</td>
                        <td className="py-3 px-4 text-gray-600">{item.totalSold} قطعة</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'orders' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">الطلبات حسب المحل</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ordersByShop.map((shop) => (
                  <div key={shop.shopId} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">{shop.shopName}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">عدد الطلبات</span>
                      <span className="text-2xl font-bold text-amber-600">{shop.orderCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport === 'delivery' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">سجل التوصيل</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-2 px-4 font-medium text-gray-700">رقم الطلب</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">المحل</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">عدد المنتجات</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">تاريخ التوصيل</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryLog.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-800">#{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.shopName}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(order.updatedAt).toLocaleDateString('ar')}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {order.deliveryNote || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">إجمالي الطلبات</h4>
            <p className="text-2xl font-bold text-blue-900">{mockOrders.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">الطلبات المكتملة</h4>
            <p className="text-2xl font-bold text-green-900">
              {mockOrders.filter(o => o.status === 'delivered').length}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-1">قيد التحضير</h4>
            <p className="text-2xl font-bold text-yellow-900">
              {mockOrders.filter(o => o.status === 'preparing').length}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-1">المحلات النشطة</h4>
            <p className="text-2xl font-bold text-purple-900">{mockShops.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;