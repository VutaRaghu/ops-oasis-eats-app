
import { MenuItem, Order, Expense, StaffMember, Attendance, DailySales, ExpenseCategory } from '@/types';

export const menuItems: MenuItem[] = [
  { catalogueNumber: 1, itemName: "Chicken Biryani Full", price: 180, category: "Biryanis" },
  { catalogueNumber: 2, itemName: "Chicken Biryani Half", price: 130, category: "Biryanis" },
  { catalogueNumber: 3, itemName: "Dum Chicken Biryani Full", price: 180, category: "Biryanis" },
  { catalogueNumber: 4, itemName: "Dum Chicken Biryani Half", price: 130, category: "Biryanis" },
  { catalogueNumber: 5, itemName: "Prawns Biryani", price: 200, category: "Biryanis" },
  { catalogueNumber: 6, itemName: "Mutton Biryani", price: 250, category: "Biryanis" },
  { catalogueNumber: 7, itemName: "Chicken Pakodi", price: 120, category: "Starters" },
  { catalogueNumber: 8, itemName: "Chilli Chicken", price: 150, category: "Starters" },
  { catalogueNumber: 9, itemName: "Chicken Lolipops", price: 150, category: "Starters" },
  { catalogueNumber: 10, itemName: "Chicken Pakodi", price: 50, category: "Starters" },
  { catalogueNumber: 11, itemName: "Chicken Pakodi", price: 100, category: "Starters" },
  { catalogueNumber: 12, itemName: "Water Bottle/Cool Drink/Soda", price: 20, category: "Cool Drinks" },
  { catalogueNumber: 13, itemName: "Water Bottle /Soda", price: 30, category: "Cool Drinks" },
  { catalogueNumber: 14, itemName: "Cool Drink", price: 50, category: "Cool Drinks" },
  { catalogueNumber: 15, itemName: "100 Rs Biryani", price: 100, category: "Biryanis" },
  { catalogueNumber: 16, itemName: "150 Rs Biryani", price: 150, category: "Biryanis" },
  { catalogueNumber: 17, itemName: "Jumbo Biryani", price: 250, category: "Biryanis" },
];

export const generateSampleOrders = (): Order[] => {
  const orders: Order[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const randomItems = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const randomMenuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      return {
        menuItem: randomMenuItem,
        quantity,
        subtotal: randomMenuItem.price * quantity
      };
    });
    
    const total = randomItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    const paymentMethods: ('Cash' | 'Card' | 'UPI' | 'Credit')[] = ['Cash', 'Card', 'UPI', 'Credit'];
    const orderStatuses: ('Draft' | 'Completed' | 'Cancelled')[] = ['Draft', 'Completed', 'Cancelled'];
    
    orders.push({
      id: `ORDER-${i.toString().padStart(4, '0')}`,
      items: randomItems,
      totalAmount: total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      tableNumber: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return orders;
};

export const expenses: Expense[] = [
  {
    id: "EXP-0001",
    category: "Ingredients",
    subCategory: "Meat",
    amount: 2500,
    description: "Chicken purchase for the week",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paidBy: "Manager"
  },
  {
    id: "EXP-0002",
    category: "Utilities",
    subCategory: "Electricity",
    amount: 3500,
    description: "Monthly electricity bill",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paidBy: "Owner"
  },
  {
    id: "EXP-0003",
    category: "Salaries",
    subCategory: "Kitchen Staff",
    amount: 15000,
    description: "Cook's salary",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paidBy: "Owner"
  },
  {
    id: "EXP-0004",
    category: "Ingredients",
    subCategory: "Rice",
    amount: 1200,
    description: "Rice bag (25kg)",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    paidBy: "Manager"
  },
  {
    id: "EXP-0005",
    category: "Maintenance",
    subCategory: "Equipment",
    amount: 500,
    description: "Stove repair",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paidBy: "Manager"
  }
];

export const expenseCategories: ExpenseCategory[] = [
  {
    name: "Ingredients",
    subCategories: ["Meat", "Rice", "Vegetables", "Spices", "Oil", "Other"]
  },
  {
    name: "Utilities",
    subCategories: ["Electricity", "Water", "Gas", "Internet", "Phone"]
  },
  {
    name: "Salaries",
    subCategories: ["Kitchen Staff", "Service Staff", "Management", "Casual Labor"]
  },
  {
    name: "Maintenance",
    subCategories: ["Equipment", "Building", "Furniture", "Pest Control"]
  },
  {
    name: "Marketing",
    subCategories: ["Online Ads", "Print Media", "Promotions", "Events"]
  },
  {
    name: "Miscellaneous",
    subCategories: ["Stationery", "Cleaning Supplies", "Packaging", "Other"]
  }
];

export const staffMembers: StaffMember[] = [
  { id: "STAFF-001", name: "Rajesh Kumar", role: "Cook", salary: 18000 },
  { id: "STAFF-002", name: "Sunita Sharma", role: "Cook Assistant", salary: 12000 },
  { id: "STAFF-003", name: "Anand Singh", role: "Waiter", salary: 10000 },
  { id: "STAFF-004", name: "Priya Patel", role: "Cashier", salary: 12000 },
  { id: "STAFF-005", name: "Vikram Khanna", role: "Manager", salary: 25000 }
];

export const generateAttendance = (): Attendance[] => {
  const attendance: Attendance[] = [];
  
  // Last 7 days attendance
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    for (const staff of staffMembers) {
      // Randomly decide status with 80% chance of present
      const random = Math.random();
      let status: 'Present' | 'Absent' | 'Half-day' = 'Present';
      
      if (random > 0.8 && random < 0.9) {
        status = 'Half-day';
      } else if (random >= 0.9) {
        status = 'Absent';
      }
      
      // Generate clock in time around 9-10 AM
      const clockInHour = 9 + Math.floor(Math.random() * 2);
      const clockInMin = Math.floor(Math.random() * 60);
      const clockIn = new Date(date);
      clockIn.setHours(clockInHour, clockInMin, 0, 0);
      
      // Generate clock out time around 6-8 PM
      let clockOut: string | undefined;
      if (status !== 'Absent') {
        const clockOutHour = status === 'Present' ? 18 + Math.floor(Math.random() * 3) : 14 + Math.floor(Math.random() * 2);
        const clockOutMin = Math.floor(Math.random() * 60);
        const clockOutDate = new Date(date);
        clockOutDate.setHours(clockOutHour, clockOutMin, 0, 0);
        clockOut = clockOutDate.toISOString();
      }
      
      attendance.push({
        id: `ATT-${i}-${staff.id}`,
        staffId: staff.id,
        staffName: staff.name,
        clockIn: clockIn.toISOString(),
        clockOut,
        date: date.toISOString().split('T')[0],
        status
      });
    }
  }
  
  return attendance;
};

export const generateSalesDashboardData = (): DailySales[] => {
  const days = 7;
  const dailySales: DailySales[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    // Create category summaries
    const categories: Record<string, { totalAmount: number; itemCount: number }> = {};
    
    // Get unique categories from menu items
    const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category)));
    
    // Initialize categories
    uniqueCategories.forEach(category => {
      categories[category] = {
        totalAmount: Math.floor(Math.random() * 2000) + 1000, // Random amount between 1000-3000
        itemCount: Math.floor(Math.random() * 20) + 10 // Random count between 10-30
      };
    });
    
    // Calculate total
    const totalAmount = Object.values(categories).reduce((sum, category) => sum + category.totalAmount, 0);
    const orderCount = Math.floor(Math.random() * 20) + 10; // Random order count between 10-30
    
    dailySales.push({
      date: date.toISOString().split('T')[0],
      totalAmount,
      orderCount,
      categories
    });
  }
  
  return dailySales;
};
