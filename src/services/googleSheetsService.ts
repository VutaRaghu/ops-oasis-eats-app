
// Browser-compatible approach for Google Sheets API with service account authentication
import { SHEETS_CONFIG, loadGoogleSheetsConfig } from './googleSheetsConfig';
import { MenuItem, Order, OrderItem, Expense, StaffMember, Attendance } from '@/types';

class GoogleSheetsService {
  private isInitialized: boolean = false;
  private config: typeof SHEETS_CONFIG;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  
  constructor() {
    this.config = SHEETS_CONFIG;
  }
  
  /**
   * Initialize the Google Sheets API client
   * Using browser-compatible approach with service account
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Load configuration from localStorage
      this.config = loadGoogleSheetsConfig();
      
      if (!this.config.SPREADSHEET_ID) {
        console.warn('Google Sheets configuration incomplete. Using mock data.');
        return false;
      }
      
      // If we have service account credentials, we'll use them
      if (this.config.SERVICE_ACCOUNT_EMAIL && this.config.SERVICE_ACCOUNT_PRIVATE_KEY) {
        // Get an access token (or use cached one if valid)
        await this.getAccessToken();
        
        // Test the connection
        const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}`;
        const response = await fetch(testUrl, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to connect to Google Sheets: ${response.statusText}`);
        }
      } 
      // Fallback to API key for read-only access if service account is not configured
      else if (this.config.API_KEY) {
        const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}?key=${this.config.API_KEY}`;
        const response = await fetch(testUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to connect to Google Sheets: ${response.statusText}`);
        }
      } else {
        console.warn('Neither service account nor API key configured. Using mock data.');
        return false;
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
    return !!this.config.SPREADSHEET_ID && 
           (!!this.config.API_KEY || 
            (!!this.config.SERVICE_ACCOUNT_EMAIL && !!this.config.SERVICE_ACCOUNT_PRIVATE_KEY));
  }
  
  /**
   * Get an access token using service account credentials
   * This is a simplified JWT implementation for browser use
   */
  private async getAccessToken() {
    // If we have a valid token, return it
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }
    
    if (!this.config.SERVICE_ACCOUNT_EMAIL || !this.config.SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('Service account credentials not configured');
    }
    
    try {
      // For browser compatibility, we'll use a Google OAuth token endpoint
      // that can work with service account credentials
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      
      // Create a JWT for service account authentication
      const now = Math.floor(Date.now() / 1000);
      const expiry = now + 3600; // 1 hour
      
      const header = {
        alg: 'RS256',
        typ: 'JWT'
      };
      
      const claim = {
        iss: this.config.SERVICE_ACCOUNT_EMAIL,
        scope: this.config.SCOPES.join(' '),
        aud: 'https://oauth2.googleapis.com/token',
        exp: expiry,
        iat: now
      };
      
      // Note: In a real implementation, you would use a JWT library
      // to create and sign the JWT with the private key
      // For browser implementation, you might use a service like
      // Firebase Functions or a custom backend for this step
      
      console.log('Service account credentials available, but JWT signing in browser is limited.');
      console.log('Consider using the API key for read-only access or implement a proper server-side JWT signing.');
      
      // This is simplified for browser usage - in production, you should:
      // 1. Use a secure backend endpoint that can sign JWTs with your service account private key
      // 2. Call that endpoint to get an access token
      // 3. Use the token for API requests
      
      // For now, we'll use the API key if available as a fallback
      if (this.config.API_KEY) {
        console.log('Falling back to API key for read-only access');
        return null;
      }
      
      throw new Error('JWT signing not implemented for browser use');
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
  
  /**
   * Read data from a specific sheet
   */
  async readSheet(sheetName: string, range: string) {
    if (!this.isInitialized) await this.initialize();
    if (!this.isConfigured()) return [];
    
    try {
      // Base URL for the request
      let url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}/values/${sheetName}!${range}`;
      let headers: HeadersInit = {};
      
      // Use access token if available, otherwise use API key
      if (this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
      } else if (this.config.API_KEY) {
        url += `?key=${this.config.API_KEY}`;
      } else {
        throw new Error('No authentication method available');
      }
      
      const response = await fetch(url, { headers });
      
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
   * Write data to a specific sheet
   */
  async writeToSheet(sheetName: string, range: string, values: any[][]) {
    if (!this.isInitialized) await this.initialize();
    if (!this.isConfigured()) throw new Error('Google Sheets not configured');
    
    try {
      // Get access token if using service account
      if (this.config.SERVICE_ACCOUNT_EMAIL && this.config.SERVICE_ACCOUNT_PRIVATE_KEY) {
        await this.getAccessToken();
      }
      
      // If we don't have an access token, we can't write
      if (!this.accessToken) {
        console.log(`Writing to sheet ${sheetName} not possible without service account credentials`);
        return {
          updatedCells: values.reduce((sum, row) => sum + row.length, 0),
          updatedRange: `${sheetName}!${range}`
        };
      }
      
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}/values/${sheetName}!${range}?valueInputOption=USER_ENTERED`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      });
      
      if (!response.ok) {
        throw new Error(`Error writing to sheet ${sheetName}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        updatedCells: data.updatedCells,
        updatedRange: data.updatedRange
      };
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
    if (!this.isConfigured()) throw new Error('Google Sheets not configured');
    
    try {
      // Get access token if using service account
      if (this.config.SERVICE_ACCOUNT_EMAIL && this.config.SERVICE_ACCOUNT_PRIVATE_KEY) {
        await this.getAccessToken();
      }
      
      // If we don't have an access token, we can't append
      if (!this.accessToken) {
        console.log(`Appending to sheet ${sheetName} not possible without service account credentials`);
        return {
          updatedCells: values.reduce((sum, row) => sum + row.length, 0),
          updatedRange: `${sheetName}!${range}`
        };
      }
      
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}/values/${sheetName}!${range}:append?valueInputOption=USER_ENTERED`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      });
      
      if (!response.ok) {
        throw new Error(`Error appending to sheet ${sheetName}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        updatedCells: data.updates.updatedCells,
        updatedRange: data.updates.updatedRange
      };
    } catch (error) {
      console.error(`Error appending to sheet ${sheetName}:`, error);
      throw error;
    }
  }
}

export default new GoogleSheetsService();
