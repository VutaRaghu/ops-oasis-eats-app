
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRangePicker } from "@/components/reports/DateRangePicker";
import { SalesReport } from "@/components/reports/SalesReport";
import { InventoryReport } from "@/components/reports/InventoryReport";
import StaffReport from "@/components/reports/StaffReport";
import sheetService from "@/services/sheetService";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { Order, MenuItem, StaffMember, Attendance, Expense } from "@/types";

function ReportsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
    to: new Date() 
  });
  
  // Type definitions for state
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  // Get data from services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrders = await sheetService.getOrders();
        const fetchedMenuItems = await sheetService.getMenuItems();
        const fetchedExpenses = await sheetService.getExpenses();
        const fetchedStaff = await sheetService.getStaffMembers();
        const fetchedAttendance = await sheetService.getAttendance();
        
        setOrders(fetchedOrders);
        setMenuItems(fetchedMenuItems);
        setExpenses(fetchedExpenses);
        setStaff(fetchedStaff);
        setAttendance(fetchedAttendance);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load report data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchData();
  }, [toast]);

  const handleDateRangeChange = (range: DateRange) => {
    if (range?.from) {
      setDateRange({ 
        from: range.from,
        to: range.to || range.from
      });
    }
  };

  const handleDownloadReport = () => {
    // Create CSV data based on active tab
    let csvContent = "";
    let filename = "";
    
    switch (activeTab) {
      case "sales":
        csvContent = "Order ID,Date,Customer,Items,Total\n";
        orders.forEach(order => {
          csvContent += `${order.id},${order.createdAt},${order.customerName || 'N/A'},"${order.items.map((item: any) => `${item.quantity}x ${item.menuItem.itemName}`).join(', ')}",${order.totalAmount}\n`;
        });
        filename = "sales_report.csv";
        break;
        
      case "inventory":
        csvContent = "Catalog Number,Item Name,Price,Category\n";
        menuItems.forEach(item => {
          csvContent += `${item.catalogueNumber},${item.itemName},${item.price},${item.category}\n`;
        });
        filename = "inventory_report.csv";
        break;
        
      case "staff":
        csvContent = "ID,Name,Role,Salary,Contact Number\n";
        staff.forEach(member => {
          csvContent += `${member.id},${member.name},${member.role},${member.salary},${member.contactNumber || 'N/A'}\n`;
        });
        filename = "staff_report.csv";
        break;
    }
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report Downloaded",
      description: `${filename} has been downloaded to your device.`
    });
  };

  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 container py-6">
          <header className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold ml-2">Reports</h1>
              </div>
              <div className="flex items-center space-x-4">
                <DateRangePicker 
                  date={dateRange} 
                  onDateChange={handleDateRangeChange} 
                />
                <Button 
                  variant="outline" 
                  onClick={handleDownloadReport}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
              </div>
            </div>
          </header>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <Card>
              <CardHeader className="border-b px-6 py-4">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="sales">Sales Report</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
                  <TabsTrigger value="staff">Staff Report</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-6">
                <TabsContent value="sales" className="mt-0">
                  <SalesReport 
                    dateRange={dateRange}
                    orders={orders}
                    startDate={dateRange.from}
                    endDate={dateRange.to || dateRange.from}
                  />
                </TabsContent>
                
                <TabsContent value="inventory" className="mt-0">
                  <InventoryReport 
                    dateRange={dateRange}
                    menuItems={menuItems}
                    orders={orders}
                    startDate={dateRange.from}
                    endDate={dateRange.to || dateRange.from}
                  />
                </TabsContent>
                
                <TabsContent value="staff" className="mt-0">
                  <StaffReport 
                    staff={staff}
                    attendance={attendance}
                    startDate={dateRange.from}
                    endDate={dateRange.to || dateRange.from}
                  />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default ReportsPage;
