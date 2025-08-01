// بيانات تجريبية للنظام
import { User, Perfume, Stock, Order, Shop, Employee } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'مدير النظام'
  },
  {
    id: '2',
    username: 'shop1',
    password: 'shop123',
    role: 'shop',
    name: 'محل الورود',
    shopId: '1'
  },
  {
    id: '3',
    username: 'factory',
    password: 'factory123',
    role: 'factory',
    name: 'مسؤول المصنع'
  }
];

export const mockPerfumes: Perfume[] = [
  { id: '1', name: 'عود ملكي', brand: 'Antaali', description: 'عطر فاخر من العود الطبيعي' },
  { id: '2', name: 'ورد دمشقي', brand: 'Antaali', description: 'عطر الورد الدمشقي الأصيل' },
  { id: '3', name: 'مسك أبيض', brand: 'Antaali', description: 'مسك أبيض فاخر' },
  { id: '4', name: 'عنبر ذهبي', brand: 'Antaali', description: 'عطر العنبر الذهبي' },
  { id: '5', name: 'ياسمين شامي', brand: 'Antaali', description: 'عطر الياسمين الشامي' }
];

export const mockStock: Stock[] = [
  // 30ml
  { perfumeId: '1', size: '30ml', quantity: 50, minQuantity: 10 },
  { perfumeId: '2', size: '30ml', quantity: 30, minQuantity: 10 },
  { perfumeId: '3', size: '30ml', quantity: 8, minQuantity: 10 }, // كمية قليلة
  { perfumeId: '4', size: '30ml', quantity: 25, minQuantity: 10 },
  { perfumeId: '5', size: '30ml', quantity: 40, minQuantity: 10 },
  
  // 50ml
  { perfumeId: '1', size: '50ml', quantity: 35, minQuantity: 8 },
  { perfumeId: '2', size: '50ml', quantity: 20, minQuantity: 8 },
  { perfumeId: '3', size: '50ml', quantity: 15, minQuantity: 8 },
  { perfumeId: '4', size: '50ml', quantity: 5, minQuantity: 8 }, // كمية قليلة
  { perfumeId: '5', size: '50ml', quantity: 28, minQuantity: 8 },
  
  // 100ml
  { perfumeId: '1', size: '100ml', quantity: 20, minQuantity: 5 },
  { perfumeId: '2', size: '100ml', quantity: 12, minQuantity: 5 },
  { perfumeId: '3', size: '100ml', quantity: 18, minQuantity: 5 },
  { perfumeId: '4', size: '100ml', quantity: 10, minQuantity: 5 },
  { perfumeId: '5', size: '100ml', quantity: 3, minQuantity: 5 } // كمية قليلة
];

export const mockOrders: Order[] = [
  {
    id: '1',
    shopId: '1',
    shopName: 'محل الورود',
    items: [
      { perfumeId: '1', size: '50ml', quantity: 5, perfumeName: 'عود ملكي' },
      { perfumeId: '2', size: '30ml', quantity: 10, perfumeName: 'ورد دمشقي' }
    ],
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    shopId: '1',
    shopName: 'محل الورود',
    items: [
      { perfumeId: '3', size: '100ml', quantity: 3, perfumeName: 'مسك أبيض' }
    ],
    status: 'delivered',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    deliveryNote: 'تم التوصيل بنجاح'
  }
];

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'محل الورود',
    address: 'شارع الحمرا، بيروت',
    phone: '+961-1-123456',
    email: 'roses@shop.com',
    managerId: '2'
  },
  {
    id: '2',
    name: 'عطور الشرق',
    address: 'شارع المعرض، دمشق',
    phone: '+963-11-234567',
    email: 'east@perfumes.com',
    managerId: '4'
  }
];

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    position: 'مشرف الإنتاج',
    salary: 1200,
    hireDate: '2023-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'فاطمة علي',
    position: 'مسؤولة الجودة',
    salary: 1000,
    hireDate: '2023-03-20',
    isActive: true
  },
  {
    id: '3',
    name: 'محمد حسن',
    position: 'عامل تعبئة',
    salary: 800,
    hireDate: '2023-06-10',
    isActive: false
  }
];