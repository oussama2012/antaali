import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Minus, Edit2, Save, X } from 'lucide-react';
import { mockStock, mockPerfumes } from '../../data/mockData';
import { Stock, Perfume } from '../../types';

const StockManagement: React.FC = () => {
  const [stock, setStock] = useState<Stock[]>(mockStock);
  const [perfumes] = useState<Perfume[]>(mockPerfumes);
  const [selectedSize, setSelectedSize] = useState<'30ml' | '50ml' | '100ml'>('30ml');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const getPerfumeName = (perfumeId: string) => {
    return perfumes.find(p => p.id === perfumeId)?.name || 'غير معروف';
  };

  const getStockBySize = (size: '30ml' | '50ml' | '100ml') => {
    return stock.filter(s => s.size === size);
  };

  const updateQuantity = (perfumeId: string, size: string, newQuantity: number) => {
    setStock(prev => prev.map(item => 
      item.perfumeId === perfumeId && item.size === size
        ? { ...item, quantity: Math.max(0, newQuantity) }
        : item
    ));
  };

  const startEditing = (perfumeId: string, currentQuantity: number) => {
    setEditingItem(perfumeId);
    setEditQuantity(currentQuantity);
  };

  const saveEdit = (perfumeId: string, size: string) => {
    updateQuantity(perfumeId, size, editQuantity);
    setEditingItem(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditQuantity(0);
  };

  const isLowStock = (item: Stock) => {
    return item.quantity <= item.minQuantity;
  };

  const currentStock = getStockBySize(selectedSize);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="w-6 h-6 text-amber-600 ml-2" />
            إدارة المخزون
          </h2>
        </div>

        {/* Size Selector */}
        <div className="flex space-x-4 space-x-reverse mb-6">
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

        {/* Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-700">العطر</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الحجم</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الكمية المتوفرة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الحد الأدنى</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentStock.map((item) => (
                <tr key={`${item.perfumeId}-${item.size}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">
                      {getPerfumeName(item.perfumeId)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.size}</td>
                  <td className="py-4 px-4">
                    {editingItem === item.perfumeId ? (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                          min="0"
                        />
                        <button
                          onClick={() => saveEdit(item.perfumeId, item.size)}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="font-medium text-gray-800">{item.quantity}</span>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <button
                            onClick={() => updateQuantity(item.perfumeId, item.size, item.quantity - 1)}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateQuantity(item.perfumeId, item.size, item.quantity + 1)}
                            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEditing(item.perfumeId, item.quantity)}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.minQuantity}</td>
                  <td className="py-4 px-4">
                    {isLowStock(item) ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 ml-1" />
                        كمية قليلة
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        متوفر
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => updateQuantity(item.perfumeId, item.size, item.quantity + 10)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => updateQuantity(item.perfumeId, item.size, item.quantity + 50)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">إجمالي المنتجات</h4>
            <p className="text-2xl font-bold text-blue-900">{currentStock.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">إجمالي الكمية</h4>
            <p className="text-2xl font-bold text-green-900">
              {currentStock.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-1">منتجات بكمية قليلة</h4>
            <p className="text-2xl font-bold text-red-900">
              {currentStock.filter(isLowStock).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;