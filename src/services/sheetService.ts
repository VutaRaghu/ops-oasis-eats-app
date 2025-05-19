
import { MenuItem, Order, Expense, Attendance, StaffMember } from '@/types';
import { menuItems, generateSampleOrders, expenses, generateAttendance, staffMembers } from './mockData';
import googleSheetsService from './googleSheetsService';
import { SHEETS_CONFIG } from './googleSheetsConfig';

export class SheetService {
  private useMockData: boolean = true;
  
  constructor() {
    // Check if Google Sheets config is ready
    this.useMockData = !SHEETS_CONFIG.SPREADSHEET_ID;
    
    if (!this.useMockData) {
      // Initialize Google Sheets connection
      googleSheetsService.initialize()
        .catch(error => {
          console.error('Failed to initialize Google Sheets, falling back to mock data:', error);
          this.useMockData = true;
        });
    }
  }
  
  // Menu Items (Catalog)
  async getMenuItems(): Promise<MenuItem[]> {
    if (this.useMockData) {
      return Promise.resolve(menuItems);
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.MENU_ITEMS;
      const range = 'A2:E1000'; // Skip header row, get all columns
      const values = await googleSheetsService.readSheet(sheetName, range);
      
      // Map sheet data to MenuItem objects
      const items: MenuItem[] = values.map((row: any[]) => ({
        catalogueNumber: parseInt(row[0], 10),
        itemName: row[1],
        price: parseFloat(row[2]),
        category: row[3],
      }));
      
      return items;
    } catch (error) {
      console.error('Error fetching menu items from Google Sheets, falling back to mock data:', error);
      return menuItems;
    }
  }
  
  async addMenuItem(item: MenuItem): Promise<MenuItem> {
    if (this.useMockData) {
      return Promise.resolve(item);
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.MENU_ITEMS;
      await googleSheetsService.appendToSheet(sheetName, 'A:D', [
        [item.catalogueNumber, item.itemName, item.price, item.category]
      ]);
      return item;
    } catch (error) {
      console.error('Error adding menu item to Google Sheets:', error);
      throw error;
    }
  }
  
  async updateMenuItem(item: MenuItem): Promise<MenuItem> {
    if (this.useMockData) {
      return Promise.resolve(item);
    }
    
    try {
      // Find the row with this catalogue number
      const items = await this.getMenuItems();
      const index = items.findIndex(i => i.catalogueNumber === item.catalogueNumber);
      
      if (index === -1) {
        throw new Error(`Item with catalogue number ${item.catalogueNumber} not found`);
      }
      
      const sheetName = SHEETS_CONFIG.SHEETS.MENU_ITEMS;
      // Row index is +2 because of 0-indexing and header row
      const rowIndex = index + 2;
      await googleSheetsService.writeToSheet(sheetName, `A${rowIndex}:D${rowIndex}`, [
        [item.catalogueNumber, item.itemName, item.price, item.category]
      ]);
      
      return item;
    } catch (error) {
      console.error('Error updating menu item in Google Sheets:', error);
      throw error;
    }
  }
  
  async deleteMenuItem(catalogueNumber: number): Promise<void> {
    if (this.useMockData) {
      return Promise.resolve();
    }
    
    // Note: Google Sheets API doesn't have a direct "delete row" operation
    // We'd need to implement a proper deletion mechanism or mark as deleted
    console.warn('Delete operation not fully implemented for Google Sheets');
    return Promise.resolve();
  }
  
  // Orders
  async getOrders(): Promise<Order[]> {
    if (this.useMockData) {
      return Promise.resolve(generateSampleOrders());
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.SALES;
      const range = 'A2:J1000'; // Skip header row
      const values = await googleSheetsService.readSheet(sheetName, range);
      
      // Process the values and convert to Order objects
      // This is simplified - in real implementation you'd need to group by OrderID
      const orderMap = new Map<string, Order>();
      
      values.forEach((row: any[]) => {
        const orderId = row[0];
        const orderTime = row[1];
        const catalogueNumber = parseInt(row[2], 10);
        const itemName = row[3];
        const quantity = parseInt(row[4], 10);
        const price = parseFloat(row[5]);
        const total = parseFloat(row[6]);
        const paymentMethod = row[7] as any;
        const customerName = row[9] || undefined;
        
        // If this order doesn't exist yet, create it
        if (!orderMap.has(orderId)) {
          orderMap.set(orderId, {
            id: orderId,
            items: [],
            totalAmount: 0,
            paymentMethod: paymentMethod,
            status: 'Completed',
            createdAt: orderTime,
            customerName: customerName
          });
        }
        
        // Add this item to the order
        const order = orderMap.get(orderId)!;
        order.items.push({
          menuItem: {
            catalogueNumber,
            itemName,
            price,
            category: 'Unknown' // We don't have category in the sales sheet
          },
          quantity,
          subtotal: total
        });
        
        // Update total amount
        order.totalAmount += total;
      });
      
      return Array.from(orderMap.values());
    } catch (error) {
      console.error('Error fetching orders from Google Sheets, falling back to mock data:', error);
      return generateSampleOrders();
    }
  }
  
  async saveOrder(order: Order): Promise<Order> {
    if (this.useMockData) {
      console.log('Saving order to sheets:', order);
      return Promise.resolve(order);
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.SALES;
      
      // Convert order to rows for the sheet
      const rows = order.items.map(item => [
        order.id, 
        order.createdAt, 
        item.menuItem.catalogueNumber,
        item.menuItem.itemName,
        item.quantity,
        item.menuItem.price,
        item.subtotal,
        order.paymentMethod,
        '',  // Remark column
        order.customerName || ''
      ]);
      
      await googleSheetsService.appendToSheet(sheetName, 'A:J', rows);
      return order;
    } catch (error) {
      console.error('Error saving order to Google Sheets:', error);
      throw error;
    }
  }
  
  // Expenses
  async getExpenses(): Promise<Expense[]> {
    if (this.useMockData) {
      return Promise.resolve(expenses);
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.EXPENSES;
      const range = 'A2:G1000'; // Skip header row
      const values = await googleSheetsService.readSheet(sheetName, range);
      
      // Map sheet data to Expense objects
      const items: Expense[] = values.map((row: any[]) => ({
        id: row[0],
        category: row[1],
        subCategory: row[2],
        amount: parseFloat(row[3]),
        description: row[4],
        date: row[5],
        paidBy: row[6]
      }));
      
      return items;
    } catch (error) {
      console.error('Error fetching expenses from Google Sheets, falling back to mock data:', error);
      return expenses;
    }
  }
  
  async saveExpense(expense: Expense): Promise<Expense> {
    if (this.useMockData) {
      console.log('Saving expense to sheets:', expense);
      return Promise.resolve(expense);
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.EXPENSES;
      await googleSheetsService.appendToSheet(sheetName, 'A:G', [
        [
          expense.id,
          expense.category,
          expense.subCategory,
          expense.amount,
          expense.description,
          expense.date,
          expense.paidBy
        ]
      ]);
      return expense;
    } catch (error) {
      console.error('Error saving expense to Google Sheets:', error);
      throw error;
    }
  }
  
  // Staff & Attendance
  async getStaffMembers(): Promise<StaffMember[]> {
    if (this.useMockData) {
      return Promise.resolve(staffMembers);
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.STAFF;
      const range = 'A2:E1000'; // Skip header row
      const values = await googleSheetsService.readSheet(sheetName, range);
      
      // Map sheet data to StaffMember objects
      const staff: StaffMember[] = values.map((row: any[]) => ({
        id: row[0],
        name: row[1],
        role: row[2],
        salary: parseFloat(row[3]),
        contactNumber: row[4] || undefined
      }));
      
      return staff;
    } catch (error) {
      console.error('Error fetching staff from Google Sheets, falling back to mock data:', error);
      return staffMembers;
    }
  }
  
  async getAttendance(): Promise<Attendance[]> {
    if (this.useMockData) {
      return Promise.resolve(generateAttendance());
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.ATTENDANCE;
      const range = 'A2:G1000'; // Skip header row
      const values = await googleSheetsService.readSheet(sheetName, range);
      
      // Map sheet data to Attendance objects
      const items: Attendance[] = values.map((row: any[]) => ({
        id: row[0],
        staffId: row[1],
        staffName: row[2],
        clockIn: row[3],
        clockOut: row[4] || undefined,
        date: row[5],
        status: row[6] as any
      }));
      
      return items;
    } catch (error) {
      console.error('Error fetching attendance from Google Sheets, falling back to mock data:', error);
      return generateAttendance();
    }
  }
  
  async recordAttendance(attendance: Attendance): Promise<Attendance> {
    if (this.useMockData) {
      console.log('Recording attendance to sheets:', attendance);
      return Promise.resolve(attendance);
    }
    
    try {
      const sheetName = SHEETS_CONFIG.SHEETS.ATTENDANCE;
      await googleSheetsService.appendToSheet(sheetName, 'A:G', [
        [
          attendance.id,
          attendance.staffId,
          attendance.staffName,
          attendance.clockIn,
          attendance.clockOut || '',
          attendance.date,
          attendance.status
        ]
      ]);
      return attendance;
    } catch (error) {
      console.error('Error recording attendance to Google Sheets:', error);
      throw error;
    }
  }
}

// Singleton instance
const sheetService = new SheetService();
export default sheetService;
