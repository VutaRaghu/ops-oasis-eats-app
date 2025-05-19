
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SHEETS_CONFIG } from "@/services/googleSheetsConfig";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState(SHEETS_CONFIG.SPREADSHEET_ID || "");
  const [clientId, setClientId] = useState(SHEETS_CONFIG.CLIENT_ID || "");
  const [clientSecret, setClientSecret] = useState(SHEETS_CONFIG.CLIENT_SECRET || "");
  const [salesSheetName, setSalesSheetName] = useState(SHEETS_CONFIG.SHEETS.SALES);
  const [menuItemsSheetName, setMenuItemsSheetName] = useState(SHEETS_CONFIG.SHEETS.MENU_ITEMS);
  const [expensesSheetName, setExpensesSheetName] = useState(SHEETS_CONFIG.SHEETS.EXPENSES);
  const [staffSheetName, setStaffSheetName] = useState(SHEETS_CONFIG.SHEETS.STAFF);
  const [attendanceSheetName, setAttendanceSheetName] = useState(SHEETS_CONFIG.SHEETS.ATTENDANCE);
  
  const handleSave = () => {
    // In a real app, we would save these settings to localStorage or a secure storage
    localStorage.setItem("restaurant_app_spreadsheet_id", spreadsheetId);
    localStorage.setItem("restaurant_app_api_key", apiKey);
    localStorage.setItem("restaurant_app_client_id", clientId);
    localStorage.setItem("restaurant_app_client_secret", clientSecret);
    localStorage.setItem("restaurant_app_sales_sheet", salesSheetName);
    localStorage.setItem("restaurant_app_menu_sheet", menuItemsSheetName);
    localStorage.setItem("restaurant_app_expenses_sheet", expensesSheetName);
    localStorage.setItem("restaurant_app_staff_sheet", staffSheetName);
    localStorage.setItem("restaurant_app_attendance_sheet", attendanceSheetName);
    
    toast({
      title: "Settings saved",
      description: "Google Sheets configuration has been saved. Please refresh the page for changes to take effect.",
    });
  };
  
  useEffect(() => {
    // Load saved settings
    const savedSpreadsheetId = localStorage.getItem("restaurant_app_spreadsheet_id");
    const savedApiKey = localStorage.getItem("restaurant_app_api_key");
    const savedClientId = localStorage.getItem("restaurant_app_client_id");
    const savedClientSecret = localStorage.getItem("restaurant_app_client_secret");
    const savedSalesSheet = localStorage.getItem("restaurant_app_sales_sheet");
    const savedMenuSheet = localStorage.getItem("restaurant_app_menu_sheet");
    const savedExpensesSheet = localStorage.getItem("restaurant_app_expenses_sheet");
    const savedStaffSheet = localStorage.getItem("restaurant_app_staff_sheet");
    const savedAttendanceSheet = localStorage.getItem("restaurant_app_attendance_sheet");
    
    if (savedSpreadsheetId) setSpreadsheetId(savedSpreadsheetId);
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedClientId) setClientId(savedClientId);
    if (savedClientSecret) setClientSecret(savedClientSecret);
    if (savedSalesSheet) setSalesSheetName(savedSalesSheet);
    if (savedMenuSheet) setMenuItemsSheetName(savedMenuSheet);
    if (savedExpensesSheet) setExpensesSheetName(savedExpensesSheet);
    if (savedStaffSheet) setStaffSheetName(savedStaffSheet);
    if (savedAttendanceSheet) setAttendanceSheetName(savedAttendanceSheet);
  }, []);

  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 container py-6">
          <header className="mb-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold ml-2">Settings</h1>
            </div>
            <p className="text-muted-foreground mt-1">Configure your application settings</p>
          </header>
          
          <Card className="w-full mb-6 scale-in-center">
            <CardHeader>
              <CardTitle>Google Sheets Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="connection" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="connection">Connection</TabsTrigger>
                  <TabsTrigger value="sheets">Sheet Names</TabsTrigger>
                  <TabsTrigger value="help">Help</TabsTrigger>
                </TabsList>
                
                <TabsContent value="connection" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="spreadsheetId">Google Spreadsheet ID</Label>
                    <Input
                      id="spreadsheetId"
                      value={spreadsheetId}
                      onChange={(e) => setSpreadsheetId(e.target.value)}
                      placeholder="Enter spreadsheet ID from the URL"
                    />
                    <p className="text-sm text-muted-foreground">
                      Find this in your Google Sheets URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key (for read-only access)</Label>
                    <Input
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Google API Key"
                      type="password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientId">OAuth Client ID (for write access)</Label>
                    <Input
                      id="clientId"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="Enter your OAuth Client ID"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">OAuth Client Secret</Label>
                    <Input
                      id="clientSecret"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="Enter your OAuth Client Secret"
                      type="password"
                    />
                  </div>
                  
                  <Button onClick={handleSave} className="mt-4">Save Configuration</Button>
                </TabsContent>
                
                <TabsContent value="sheets" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="salesSheet">Sales Sheet Name</Label>
                    <Input
                      id="salesSheet"
                      value={salesSheetName}
                      onChange={(e) => setSalesSheetName(e.target.value)}
                      placeholder="Sheet name for sales data"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="menuSheet">Menu Items Sheet Name</Label>
                    <Input
                      id="menuSheet"
                      value={menuItemsSheetName}
                      onChange={(e) => setMenuItemsSheetName(e.target.value)}
                      placeholder="Sheet name for menu items"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expensesSheet">Expenses Sheet Name</Label>
                    <Input
                      id="expensesSheet"
                      value={expensesSheetName}
                      onChange={(e) => setExpensesSheetName(e.target.value)}
                      placeholder="Sheet name for expenses"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="staffSheet">Staff Sheet Name</Label>
                    <Input
                      id="staffSheet"
                      value={staffSheetName}
                      onChange={(e) => setStaffSheetName(e.target.value)}
                      placeholder="Sheet name for staff data"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attendanceSheet">Attendance Sheet Name</Label>
                    <Input
                      id="attendanceSheet"
                      value={attendanceSheetName}
                      onChange={(e) => setAttendanceSheetName(e.target.value)}
                      placeholder="Sheet name for attendance records"
                    />
                  </div>
                  
                  <Button onClick={handleSave} className="mt-4">Save Sheet Names</Button>
                </TabsContent>
                
                <TabsContent value="help" className="space-y-4">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Setting up Google Sheets Integration</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Create a new Google Spreadsheet or use an existing one</li>
                      <li>Create the following sheets with appropriate headers:
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Sales</strong>: OrderID, OrderTime, CatalogueNumber, ItemName, Quantity, Price, Total, PaymentMethod, Remark, CustomerName</li>
                          <li><strong>Menu Items</strong>: CatalogueNumber, ItemName, Price, Category</li>
                          <li><strong>Expenses</strong>: ID, Category, SubCategory, Amount, Description, Date, PaidBy</li>
                          <li><strong>Staff</strong>: ID, Name, Role, Salary, ContactNumber</li>
                          <li><strong>Attendance</strong>: ID, StaffID, StaffName, ClockIn, ClockOut, Date, Status</li>
                        </ul>
                      </li>
                      <li>Get your Spreadsheet ID from the URL of your Google Sheet</li>
                      <li>Create a project in Google Cloud Console and enable the Google Sheets API</li>
                      <li>Create API credentials (API key for read-only, OAuth credentials for read/write)</li>
                      <li>Enter these credentials in the Connection tab</li>
                      <li>Make sure your spreadsheet is shared with the service account email</li>
                    </ol>
                    
                    <p className="mt-4">
                      For detailed instructions on creating Google API credentials, please refer to the 
                      <a href="https://developers.google.com/sheets/api/quickstart/js" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer"> Google Sheets API documentation</a>.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="w-full scale-in-center">
            <CardHeader>
              <CardTitle>Other Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Additional application settings will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SettingsPage;
