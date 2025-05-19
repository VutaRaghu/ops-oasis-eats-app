
// Google Sheets Configuration
export const SHEETS_CONFIG = {
  // Update these values with your own Google Sheets information
  SPREADSHEET_ID: "", // Add your spreadsheet ID here
  SCOPES: ["https://www.googleapis.com/auth/spreadsheets"],
  API_KEY: "", // For public data only
  CLIENT_ID: "", // For OAuth authentication
  CLIENT_SECRET: "", // For OAuth authentication
  
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
