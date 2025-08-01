// أنواع البيانات الأساسية للنظام

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'shop' | 'factory';
  name: string;
  shopId?: string; // للمحلات فقط
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  description?: string;
}

export interface Stock {
  perfumeId: string;
  size: '30ml' | '50ml' | '100ml';
  quantity: number;
  minQuantity: number;
}

export interface OrderItem {
  perfumeId: string;
  size: '30ml' | '50ml' | '100ml';
  quantity: number;
  perfumeName?: string;
}

export interface Order {
  id: string;
  shopId: string;
  shopName: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'delivered';
  createdAt: string;
  updatedAt: string;
  deliveryNote?: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  hireDate: string;
  isActive: boolean;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface Report {
  topSellingPerfumes: Array<{
    perfumeId: string;
    perfumeName: string;
    totalSold: number;
  }>;
  ordersByShop: Array<{
    shopId: string;
    shopName: string;
    orderCount: number;
  }>;
  deliveryLog: Order[];
}