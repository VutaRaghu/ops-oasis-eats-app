
import { Order, DailySales } from '@/types';

export const generateOrderId = (): string => {
  return `ORDER-${Date.now().toString().slice(-6)}`;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const generateSalesData = (orders: Order[]): DailySales[] => {
  // Group orders by date
  const salesByDate = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = {
        date,
        totalAmount: 0,
        orderCount: 0,
        categories: {}
      };
    }
    
    acc[date].totalAmount += order.totalAmount;
    acc[date].orderCount += 1;
    
    // Group by category
    order.items.forEach(item => {
      const category = item.menuItem.category;
      
      if (!acc[date].categories[category]) {
        acc[date].categories[category] = {
          totalAmount: 0,
          itemCount: 0
        };
      }
      
      acc[date].categories[category].totalAmount += item.subtotal;
      acc[date].categories[category].itemCount += item.quantity;
    });
    
    return acc;
  }, {} as Record<string, DailySales>);
  
  // Convert to array and sort by date
  return Object.values(salesByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
