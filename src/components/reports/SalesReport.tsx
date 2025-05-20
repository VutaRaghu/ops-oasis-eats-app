
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import sheetService from "@/services/sheetService";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Order, MenuItem } from "@/types";

interface SalesReportProps {
  dateRange: DateRange;
  orders?: Order[];
  menuItems?: MenuItem[];
  startDate?: Date;
  endDate?: Date;
}

export function SalesReport({ dateRange, orders: propOrders, startDate, endDate }: SalesReportProps) {
  const { toast } = useToast();
  
  // Fetch orders data if not provided as props
  const { data: fetchedOrders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => sheetService.getOrders(),
    enabled: !propOrders,
  });
  
  // Use either the prop orders or fetched orders
  const orders = propOrders || fetchedOrders;
  
  if (isLoading) {
    return (
      <div className="p-6 rounded-lg border bg-card text-card-foreground">
        <h3 className="text-lg font-medium mb-4">Loading sales data...</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load sales data",
      variant: "destructive"
    });
    
    return (
      <div className="p-6 rounded-lg border bg-card text-card-foreground">
        <h3 className="text-lg font-medium mb-4">Error loading sales data</h3>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }
  
  // Determine date range from props or component props
  const effectiveDateRange = {
    from: startDate || dateRange.from,
    to: endDate || dateRange.to || dateRange.from
  };
  
  // Filter orders by date range
  const filteredOrders = orders?.filter(order => {
    const orderDate = new Date(order.createdAt);
    if (effectiveDateRange.from && effectiveDateRange.to) {
      return orderDate >= effectiveDateRange.from && orderDate <= effectiveDateRange.to;
    }
    return true;
  }) || [];
  
  // Calculate total sales
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const orderCount = filteredOrders.length;
  
  // Group by payment method
  const paymentMethodData = filteredOrders.reduce((acc, order) => {
    const method = order.paymentMethod;
    if (!acc[method]) {
      acc[method] = { name: method, amount: 0, count: 0 };
    }
    acc[method].amount += order.totalAmount;
    acc[method].count += 1;
    return acc;
  }, {} as Record<string, { name: string, amount: number, count: number }>);
  
  // Group by date for trends
  const salesByDate = filteredOrders.reduce((acc, order) => {
    const dateStr = format(new Date(order.createdAt), 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, amount: 0, orders: 0 };
    }
    acc[dateStr].amount += order.totalAmount;
    acc[dateStr].orders += 1;
    return acc;
  }, {} as Record<string, { date: string, amount: number, orders: number }>);
  
  const paymentMethodChartData = Object.values(paymentMethodData);
  const salesTrendsChartData = Object.values(salesByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <div className="space-y-4">
      {/* Sales Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold">₹{totalSales.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Order Count</p>
            <p className="text-2xl font-bold">{orderCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
            <p className="text-2xl font-bold">
              ₹{orderCount > 0 ? (totalSales / orderCount).toFixed(2) : "0.00"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Trends Chart */}
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="mb-4">Sales Trends</CardTitle>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesTrendsChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Sales Amount" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Methods Chart */}
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="mb-4">Sales by Payment Method</CardTitle>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paymentMethodChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
                <Legend />
                <Bar dataKey="amount" name="Sales Amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="mb-4">Recent Orders</CardTitle>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableCaption>Showing up to 10 recent orders</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.slice(0, 10).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>{order.customerName || '-'}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell className="text-right">₹{order.totalAmount}</TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No orders found for the selected date range
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
