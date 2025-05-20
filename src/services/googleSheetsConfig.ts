
// Google Sheets Configuration
export const SHEETS_CONFIG = {
  // Update these values with your own Google Sheets information
  SPREADSHEET_ID: "", // Add your spreadsheet ID here
  SCOPES: ["https://www.googleapis.com/auth/spreadsheets"],
  API_KEY: "", // For public data only
  
  // Service account credentials
  SERVICE_ACCOUNT_EMAIL: "",
  SERVICE_ACCOUNT_PRIVATE_KEY: "",
  
  // Sheet names - adjust according to your spreadsheet structure
  SHEETS: {
    SALES: "Sales",
    MENU_ITEMS: "Menu Items",
    EXPENSES: "Expenses",
    STAFF: "Staff",
    ATTENDANCE: "Attendance"
  },
  
  // Column mappings - adjust according to your spreadsheet structure
  SALES_COLUMNS: {
    ORDER_ID: "A",
    ORDER_TIME: "B",
    CATALOGUE_NUMBER: "C",
    ITEM_NAME: "D",
    QUANTITY: "E",
    PRICE: "F",
    TOTAL: "G",
    PAYMENT_METHOD: "H",
    REMARK: "I",
    CUSTOMER_NAME: "J"
  }
};

export const SAMPLE_CREDENTIALS = {
  client_email: "your-service-account-email@your-project.iam.gserviceaccount.com",
  private_key: "YOUR_PRIVATE_KEY_HERE",
};

// Load configuration from localStorage
export const loadGoogleSheetsConfig = () => {
  const spreadsheetId = localStorage.getItem("restaurant_app_spreadsheet_id") || "";
  const apiKey = localStorage.getItem("restaurant_app_api_key") || "";
  const serviceAccountEmail = localStorage.getItem("restaurant_app_service_account_email") || "";
  const serviceAccountPrivateKey = localStorage.getItem("restaurant_app_service_account_private_key") || "";
  
  // Sheet names
  const salesSheet = localStorage.getItem("restaurant_app_sales_sheet") || SHEETS_CONFIG.SHEETS.SALES;
  const menuItemsSheet = localStorage.getItem("restaurant_app_menu_sheet") || SHEETS_CONFIG.SHEETS.MENU_ITEMS;
  const expensesSheet = localStorage.getItem("restaurant_app_expenses_sheet") || SHEETS_CONFIG.SHEETS.EXPENSES;
  const staffSheet = localStorage.getItem("restaurant_app_staff_sheet") || SHEETS_CONFIG.SHEETS.STAFF;
  const attendanceSheet = localStorage.getItem("restaurant_app_attendance_sheet") || SHEETS_CONFIG.SHEETS.ATTENDANCE;
  
  return {
    SPREADSHEET_ID: spreadsheetId,
    API_KEY: apiKey,
    SERVICE_ACCOUNT_EMAIL: serviceAccountEmail,
    SERVICE_ACCOUNT_PRIVATE_KEY: serviceAccountPrivateKey,
    SHEETS: {
      SALES: salesSheet,
      MENU_ITEMS: menuItemsSheet,
      EXPENSES: expensesSheet,
      STAFF: staffSheet,
      ATTENDANCE: attendanceSheet
    },
    SCOPES: SHEETS_CONFIG.SCOPES,
    SALES_COLUMNS: SHEETS_CONFIG.SALES_COLUMNS
  };
};
