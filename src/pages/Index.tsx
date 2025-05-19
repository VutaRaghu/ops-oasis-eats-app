
import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { PopularItems } from '@/components/dashboard/PopularItems';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { MenuItem, Order, DailySales } from '@/types';
import sheetService from '@/services/sheetService';
import { generateSalesData } from '@/utils/helpers';
import { generateSalesDashboardData } from '@/services/mockData';

import { 
  Calendar as CalendarIcon, 
  Menu as MenuIcon, 
  User as UserIcon, 
  Settings as SettingsIcon 
} from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<DailySales[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch menu items and orders
        const [items, orderData] = await Promise.all([
          sheetService.getMenuItems(),
          sheetService.getOrders()
        ]);
        
        setMenuItems(items);
        setOrders(orderData);
        
        // Generate sales data (this would come from a real API in production)
        setSalesData(generateSalesDashboardData());
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Calculate dashboard metrics
  const completedOrders = orders.filter(order => order.status === 'Completed');
  const totalSales = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todaySales = completedOrders
    .filter(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      const today = new Date().toDateString();
      return orderDate === today;
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const ordersToday = completedOrders.filter(order => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  }).length;
  
  // Calculate percentage change for today vs. yesterday
  const yesterdaySales = completedOrders
    .filter(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return orderDate === yesterday.toDateString();
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const salesPercentageChange = yesterdaySales > 0 
    ? ((todaySales - yesterdaySales) / yesterdaySales * 100).toFixed(1)
    : '0.0';
  
  const salesTrend = todaySales > yesterdaySales ? 'up' : todaySales < yesterdaySales ? 'down' : 'neutral';

  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 container py-6">
          <header className="mb-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold ml-2">Dashboard</h1>
            </div>
            <p className="text-muted-foreground mt-1">Welcome to your Restaurant Operations Dashboard!</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCard 
              title="Today's Sales" 
              value={`₹${todaySales.toLocaleString()}`}
              description="vs. yesterday"
              trend={salesTrend}
              trendValue={`${salesPercentageChange}%`}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <DashboardCard 
              title="Today's Orders" 
              value={ordersToday}
              description="Completed orders"
              icon={<MenuIcon className="h-4 w-4" />}
            />
            <DashboardCard 
              title="Total Sales" 
              value={`₹${totalSales.toLocaleString()}`}
              description="All time"
              icon={<SettingsIcon className="h-4 w-4" />}
            />
            <DashboardCard 
              title="Active Menu Items" 
              value={menuItems.length}
              description="Across categories"
              icon={<UserIcon className="h-4 w-4" />}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SalesChart salesData={salesData} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecentOrders orders={orders} />
            <CategoryBreakdown salesData={salesData} />
            <PopularItems menuItems={menuItems} />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
