
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DateRangePicker } from "@/components/reports/DateRangePicker";
import { SalesReport } from "@/components/reports/SalesReport";
import { InventoryReport } from "@/components/reports/InventoryReport";
import { StaffReport } from "@/components/reports/StaffReport";

const ReportsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sales");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

  const handleExportToSheets = () => {
    setIsGenerating(true);
    
    // This would connect to Google Sheets and export the data
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Exported",
        description: "The report has been exported to Google Sheets successfully.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 container py-6">
          <header className="mb-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold ml-2">Reports</h1>
            </div>
            <p className="text-muted-foreground mt-1">View and generate business reports</p>
          </header>
          
          <Card className="w-full scale-in-center">
            <CardHeader>
              <CardTitle>Reports Dashboard</CardTitle>
              <CardDescription>
                Generate and export reports based on your Google Sheets data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <TabsList>
                    <TabsTrigger value="sales">Sales Reports</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
                    <TabsTrigger value="staff">Staff Reports</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <DateRangePicker 
                      date={dateRange} 
                      onDateChange={setDateRange}
                    />
                    <Button 
                      onClick={handleExportToSheets} 
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Exporting..." : "Export to Sheets"}
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="sales" className="space-y-4">
                  <SalesReport dateRange={dateRange} />
                </TabsContent>
                
                <TabsContent value="inventory" className="space-y-4">
                  <InventoryReport dateRange={dateRange} />
                </TabsContent>
                
                <TabsContent value="staff" className="space-y-4">
                  <StaffReport dateRange={dateRange} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ReportsPage;
