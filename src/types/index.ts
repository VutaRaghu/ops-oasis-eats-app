
export interface MenuItem {
  catalogueNumber: number;
  itemName: string;
  price: number;
  category: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  customerName?: string;
  tableNumber?: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
}

export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Credit';
export type OrderStatus = 'Draft' | 'Completed' | 'Cancelled';

export interface Expense {
  id: string;
  category: string;
  subCategory: string;
  amount: number;
  description: string;
  date: string;
  paidBy: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  salary: number;
  contactNumber?: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  staffName: string;
  clockIn: string;
  clockOut?: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half-day';
}

export interface DailySales {
  date: string;
  totalAmount: number;
  orderCount: number;
  categories: {
    [category: string]: {
      totalAmount: number;
      itemCount: number;
    }
  }
}

export interface ExpenseCategory {
  name: string;
  subCategories: string[];
}
