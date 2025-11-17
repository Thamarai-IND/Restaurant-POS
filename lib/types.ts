export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
  stock?: number; // current stock for this item
  lowStockThreshold?: number; // threshold for warnings
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod?: string;
}

export interface SalesReport {
  month: string;
  totalSales: number;
  totalOrders: number;
  items: { name: string; quantity: number; revenue: number }[];
}

