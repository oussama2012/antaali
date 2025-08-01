import React, { useState } from 'react';
import { Store, Plus, Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { mockShops } from '../../data/mockData';
import { Shop } from '../../types';

const ShopManagement: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    managerId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingShop) {
      // تحديث محل موجود
      setShops(prev => prev.map(shop => 
        shop.id === editingShop.id 
          ? { ...shop, ...formData }
          : shop
      ));
      setEditingShop(null);
    } else {
      // إضافة محل جديد
      const newShop: Shop = {
        id: Date.now().toString(),
        ...formData
      };
      setShops(prev => [...prev, newShop]);
    }
    
    setFormData({ name: '', address: '', phone: '', email: '', managerId: '' });
    setShowAddForm(false);
  };

  const startEdit = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
      managerId: shop.managerId
    });
    setShowAddForm(true);
  };

  const deleteShop = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المحل؟')) {
      setShops(prev => prev.filter(shop => shop.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Store className="w-6 h-6 text-amber-600 ml-2" />
            إدارة المحلات
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة محل</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {editingShop ? 'تعديل المحل' : 'إضافة محل جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المحل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">معرف المدير</label>
                <input
                  type="text"
                  value={formData.managerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="معرف المستخدم المسؤول عن المحل"
                  required
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingShop(null);
                    setFormData({ name: '', address: '', phone: '', email: '', managerId: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingShop ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{shop.name}</h3>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => startEdit(shop)}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                    title="تعديل"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteShop(shop.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.address}</span>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{shop.phone}</span>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{shop.email}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  معرف المدير: {shop.managerId}
                </div>
              </div>
            </div>
          ))}
        </div>

        {shops.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا يوجد محلات مسجلة
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopManagement;