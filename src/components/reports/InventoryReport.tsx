
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import sheetService from "@/services/sheetService";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface InventoryReportProps {
  dateRange: DateRange;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];

export function InventoryReport({ dateRange }: InventoryReportProps) {
  // Fetch menu items data
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => sheetService.getMenuItems(),
  });
  
  // Fetch orders data to calculate item popularity
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => sheetService.getOrders(),
  });
  
  if (isLoading) {
    return (
      <div className="p-6 rounded-lg border bg-card text-card-foreground">
        <h3 className="text-lg font-medium mb-4">Loading inventory data...</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Calculate items sold in date range
  const filteredOrders = orders?.filter(order => {
    const orderDate = new Date(order.createdAt);
    if (dateRange.from && dateRange.to) {
      return orderDate >= dateRange.from && orderDate <= dateRange.to;
    }
    return true;
  }) || [];
  
  // Count sold items
  const soldItems: Record<number, { count: number, revenue: number }> = {};
  
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const catalogueNumber = item.menuItem.catalogueNumber;
      if (!soldItems[catalogueNumber]) {
        soldItems[catalogueNumber] = { count: 0, revenue: 0 };
      }
      soldItems[catalogueNumber].count += item.quantity;
      soldItems[catalogueNumber].revenue += item.subtotal;
    });
  });
  
  // Group by category
  const categoryCounts = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { name: item.category, count: 0 };
    }
    acc[item.category].count += 1;
    return acc;
  }, {} as Record<string, { name: string, count: number }>);
  
  const categoryData = Object.values(categoryCounts || {});
  
  // Create item sales data
  const itemSalesData = menuItems?.map(item => ({
    id: item.catalogueNumber,
    name: item.itemName,
    category: item.category,
    price: item.price,
    quantitySold: soldItems[item.catalogueNumber]?.count || 0,
    revenue: soldItems[item.catalogueNumber]?.revenue || 0
  })).sort((a, b) => b.quantitySold - a.quantitySold) || [];

  return (
    <div className="space-y-4">
      {/* Category Distribution */}
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="mb-4">Menu Items by Category</CardTitle>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} items`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Item Sales Table */}
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="mb-4">Item Sales</CardTitle>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableCaption>Showing all menu items sorted by quantity sold</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Catalogue #</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Qty Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemSalesData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell className="text-right">{item.quantitySold}</TableCell>
                    <TableCell className="text-right">₹{item.revenue}</TableCell>
                  </TableRow>
                ))}
                {itemSalesData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No items found
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
