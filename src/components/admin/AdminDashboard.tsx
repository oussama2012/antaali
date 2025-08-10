import React, { useState } from 'react';
import Layout from '../Layout';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Store, 
  BarChart3, 
  Upload,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import StockManagement from './StockManagement';
import OrdersManagement from './OrdersManagement';
import EmployeeManagement from './EmployeeManagement';
import ShopManagement from './ShopManagement';
import Reports from './Reports';
import FileUpload from './FileUpload';

type AdminView = 'overview' | 'stock' | 'orders' | 'employees' | 'shops' | 'reports' | 'upload';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'stock', label: 'إدارة المخزون', icon: Package },
    { id: 'orders', label: 'إدارة الطلبات', icon: ShoppingCart },
    { id: 'employees', label: 'إدارة الموظفين', icon: Users },
    { id: 'shops', label: 'إدارة المحلات', icon: Store },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'upload', label: 'رفع الملفات', icon: Upload }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'stock':
        return <StockManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'employees':
        return <EmployeeManagement />;
      case 'shops':
        return <ShopManagement />;
      case 'reports':
        return <Reports />;
      case 'upload':
        return <FileUpload />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <Layout title="لوحة تحكم المدير">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm p-4">
          <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:space-y-2 lg:block">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as AdminView)}
                  className={`w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start space-y-1 lg:space-y-0 lg:space-x-3 lg:space-x-reverse px-2 lg:px-4 py-2 lg:py-3 rounded-lg text-center lg:text-right transition-colors ${
                    currentView === item.id
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-xs lg:text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

const OverviewContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المحلات</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <Store className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الموظفين</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-500 ml-2" />
          تنبيهات المخزون
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <p className="font-medium text-yellow-800">مسك أبيض - 30ml</p>
              <p className="text-sm text-yellow-600">الكمية المتوفرة: 8 قطع (أقل من الحد الأدنى)</p>
            </div>
            <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
              كمية قليلة
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="font-medium text-red-800">عنبر ذهبي - 50ml</p>
              <p className="text-sm text-red-600">الكمية المتوفرة: 5 قطع (أقل من الحد الأدنى)</p>
            </div>
            <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
              نفدت تقريباً
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-500 ml-2" />
          النشاط الأخير
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">تم توصيل طلب #2 إلى محل الورود</p>
              <p className="text-xs text-gray-500">منذ ساعتين</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">طلب جديد #1 من محل الورود</p>
              <p className="text-xs text-gray-500">منذ 4 ساعات</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">تحديث مخزون العطور</p>
              <p className="text-xs text-gray-500">أمس</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;