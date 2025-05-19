
import { MenuItem, Order, Expense, Attendance, StaffMember } from '@/types';
import { menuItems, generateSampleOrders, expenses, generateAttendance, staffMembers } from './mockData';

// Mock implementation - to be replaced with actual Google Sheets API integration
export class SheetService {
  // Menu Items (Catalog)
  async getMenuItems(): Promise<MenuItem[]> {
    // In production, this would fetch from Google Sheets
    return Promise.resolve(menuItems);
  }
  
  async addMenuItem(item: MenuItem): Promise<MenuItem> {
    // In production, this would add to Google Sheets
    return Promise.resolve(item);
  }
  
  async updateMenuItem(item: MenuItem): Promise<MenuItem> {
    // In production, this would update in Google Sheets
    return Promise.resolve(item);
  }
  
  async deleteMenuItem(catalogueNumber: number): Promise<void> {
    // In production, this would delete from Google Sheets
    return Promise.resolve();
  }
  
  // Orders
  async getOrders(): Promise<Order[]> {
    // In production, this would fetch from Google Sheets
    return Promise.resolve(generateSampleOrders());
  }
  
  async saveOrder(order: Order): Promise<Order> {
    // In production, this would save to Google Sheets
    console.log('Saving order to sheets:', order);
    return Promise.resolve(order);
  }
  
  // Expenses
  async getExpenses(): Promise<Expense[]> {
    // In production, this would fetch from Google Sheets
    return Promise.resolve(expenses);
  }
  
  async saveExpense(expense: Expense): Promise<Expense> {
    // In production, this would save to Google Sheets
    console.log('Saving expense to sheets:', expense);
    return Promise.resolve(expense);
  }
  
  // Staff & Attendance
  async getStaffMembers(): Promise<StaffMember[]> {
    // In production, this would fetch from Google Sheets
    return Promise.resolve(staffMembers);
  }
  
  async getAttendance(): Promise<Attendance[]> {
    // In production, this would fetch from Google Sheets
    return Promise.resolve(generateAttendance());
  }
  
  async recordAttendance(attendance: Attendance): Promise<Attendance> {
    // In production, this would save to Google Sheets
    console.log('Recording attendance to sheets:', attendance);
    return Promise.resolve(attendance);
  }
}

// Singleton instance
const sheetService = new SheetService();
export default sheetService;
