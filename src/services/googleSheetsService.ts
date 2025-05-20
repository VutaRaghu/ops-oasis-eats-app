
// Rather than using the googleapis npm package directly in the browser
// which causes "process is not defined" error, we'll use a browser-compatible approach
// with the Google Sheets API REST interface

import { SHEETS_CONFIG, loadGoogleSheetsConfig } from './googleSheetsConfig';
import { MenuItem, Order, OrderItem, Expense, StaffMember, Attendance } from '@/types';

class GoogleSheetsService {
  private isInitialized: boolean = false;
  private config: typeof SHEETS_CONFIG;
  
  constructor() {
    this.config = SHEETS_CONFIG;
  }
  
  /**
   * Initialize the Google Sheets API client
   * Using browser-compatible approach
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Load configuration from localStorage
      this.config = loadGoogleSheetsConfig();
      
      if (!this.config.SPREADSHEET_ID || !this.config.API_KEY) {
        console.warn('Google Sheets configuration incomplete. Using mock data.');
        return false;
      }
      
      // Test the connection with a simple request
      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}?key=${this.config.API_KEY}`;
      const response = await fetch(testUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to connect to Google Sheets: ${response.statusText}`);
      }
      
      this.isInitialized = true;
      console.log('Google Sheets API initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Sheets API:', error);
      return false;
    }
  }
  
  /**
   * Check if Google Sheets is properly configured
   */
  isConfigured() {
    this.config = loadGoogleSheetsConfig();
    return !!this.config.SPREADSHEET_ID && !!this.config.API_KEY;
  }
  
  /**
   * Read data from a specific sheet
   */
  async readSheet(sheetName: string, range: string) {
    if (!this.isInitialized) await this.initialize();
    if (!this.isConfigured()) return [];
    
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}/values/${sheetName}!${range}?key=${this.config.API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error reading from sheet ${sheetName}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error(`Error reading from sheet ${sheetName}:`, error);
      throw error;
    }
  }
  
  /**
   * Write data to a specific sheet - requires OAuth authentication
   * This is a simplified implementation that may need further OAuth handling
   */
  async writeToSheet(sheetName: string, range: string, values: any[][]) {
    if (!this.isInitialized) await this.initialize();
    if (!this.isConfigured()) throw new Error('Google Sheets not configured');
    
    console.log(`Writing to sheet ${sheetName} at range ${range}`, values);
    // In a real implementation, this would use OAuth credentials
    // For now we'll just log it since browser-based OAuth requires more setup
    
    // Mock success response
    return {
      updatedCells: values.reduce((sum, row) => sum + row.length, 0),
      updatedRange: `${sheetName}!${range}`
    };
  }
  
  /**
   * Append data to a specific sheet
   */
  async appendToSheet(sheetName: string, range: string, values: any[][]) {
    if (!this.isInitialized) await this.initialize();
    if (!this.isConfigured()) throw new Error('Google Sheets not configured');
    
    console.log(`Appending to sheet ${sheetName} at range ${range}`, values);
    // In a real implementation, this would use OAuth credentials
    // For now we'll just log it since browser-based OAuth requires more setup
    
    // Mock success response
    return {
      updatedCells: values.reduce((sum, row) => sum + row.length, 0),
      updatedRange: `${sheetName}!${range}`
    };
  }
}

export default new GoogleSheetsService();
