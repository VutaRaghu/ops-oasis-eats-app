
import { google, sheets_v4 } from 'googleapis';
import { SHEETS_CONFIG } from './googleSheetsConfig';
import { MenuItem, Order, OrderItem, Expense, StaffMember, Attendance } from '@/types';

class GoogleSheetsService {
  private sheets: sheets_v4.Sheets | null = null;
  private isInitialized: boolean = false;
  
  constructor() {
    // Initialize will be called explicitly
  }
  
  /**
   * Initialize the Google Sheets API client
   * This can be done with API key (read-only) or OAuth (read/write)
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // For development/testing, using API key (read-only)
      if (SHEETS_CONFIG.API_KEY) {
        const auth = new google.auth.GoogleAuth({
          scopes: SHEETS_CONFIG.SCOPES
        });
        
        this.sheets = google.sheets({ 
          version: 'v4', 
          auth: new google.auth.JWT(
            // Replace with your service account details from Google Cloud Console
            SHEETS_CONFIG.CLIENT_ID,
            undefined,
            SHEETS_CONFIG.CLIENT_SECRET,
            SHEETS_CONFIG.SCOPES
          )
        });
        this.isInitialized = true;
        console.log('Google Sheets API initialized successfully');
      } else {
        console.error('No API key or OAuth credentials provided');
        throw new Error('Google Sheets API configuration missing');
      }
    } catch (error) {
      console.error('Failed to initialize Google Sheets API:', error);
      throw error;
    }
  }
  
  /**
   * Read data from a specific sheet
   */
  async readSheet(sheetName: string, range: string) {
    if (!this.isInitialized) await this.initialize();
    if (!this.sheets) throw new Error('Sheets API not initialized');
    
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!${range}`,
      });
      
      return response.data.values || [];
    } catch (error) {
      console.error(`Error reading from sheet ${sheetName}:`, error);
      throw error;
    }
  }
  
  /**
   * Write data to a specific sheet
   */
  async writeToSheet(sheetName: string, range: string, values: any[][]) {
    if (!this.isInitialized) await this.initialize();
    if (!this.sheets) throw new Error('Sheets API not initialized');
    
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!${range}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error writing to sheet ${sheetName}:`, error);
      throw error;
    }
  }
  
  /**
   * Append data to a specific sheet
   */
  async appendToSheet(sheetName: string, range: string, values: any[][]) {
    if (!this.isInitialized) await this.initialize();
    if (!this.sheets) throw new Error('Sheets API not initialized');
    
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!${range}`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error appending to sheet ${sheetName}:`, error);
      throw error;
    }
  }
}

export default new GoogleSheetsService();
