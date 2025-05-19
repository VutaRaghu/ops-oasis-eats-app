
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("sales");

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
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="sales">Sales Reports</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
                  <TabsTrigger value="staff">Staff Reports</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sales" className="space-y-4">
                  <div className="p-6 rounded-lg border bg-card text-card-foreground">
                    <h3 className="text-lg font-medium mb-4">Sales Overview</h3>
                    <p className="text-muted-foreground mb-4">
                      Sales reporting functionality coming soon. This section will display sales trends, 
                      revenue by category, and other sales metrics.
                    </p>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                      <p className="text-muted-foreground">Sales chart visualization will appear here</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="inventory" className="space-y-4">
                  <div className="p-6 rounded-lg border bg-card text-card-foreground">
                    <h3 className="text-lg font-medium mb-4">Inventory Status</h3>
                    <p className="text-muted-foreground mb-4">
                      Inventory reporting functionality coming soon. This section will display stock levels,
                      low inventory alerts, and consumption patterns.
                    </p>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                      <p className="text-muted-foreground">Inventory status visualization will appear here</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="staff" className="space-y-4">
                  <div className="p-6 rounded-lg border bg-card text-card-foreground">
                    <h3 className="text-lg font-medium mb-4">Staff Performance</h3>
                    <p className="text-muted-foreground mb-4">
                      Staff reporting functionality coming soon. This section will display attendance records,
                      performance metrics, and scheduled hours.
                    </p>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                      <p className="text-muted-foreground">Staff performance visualization will appear here</p>
                    </div>
                  </div>
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
