<<<<<<< HEAD
const fs = require('fs').promises;
const path = require('path');

class SessionService {
  constructor() {
    // Use relative path from project root
    this.sessionDir = path.join(__dirname, '..', 'session');
    this.filePath = path.join(this.sessionDir, 'session.json');
  }

  async ensureSessionDirectory() {
    try {
      await fs.mkdir(this.sessionDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }

  async getSession() {
    try {
      console.log('Reading data from session file:', this.filePath);
      const data = await fs.readFile(this.filePath, 'utf8');
      console.log('Session data:', data);
      const dataObj = JSON.parse(data);
      return dataObj;
    } catch (error) {
      console.error('Error in getSession:', error.message);
      return {}; // Return empty object if file doesn't exist or can't be read
    }
  }

  async setSession(objData) {
    try {
      console.log('Writing data to session file:', objData);
      await this.ensureSessionDirectory();
      const data = JSON.stringify(objData, null, 2);
      console.log('Writing Data:', data);
      await fs.writeFile(this.filePath, data);
      console.log('Session data saved successfully to:', this.filePath);
    } catch (error) {
      console.error('Error in setSession:', error.message);
      throw error;
    }
  }
=======
import fs from 'fs/promises';

const SESSION_FILE_PATH = './session/session.json';

class SessionService {
  constructor() {
    this.filePath = SESSION_FILE_PATH;
  }
  async getSession() {
  try {
    console.log('Reading data from session file.');
    const data = await fs.readFile(this.filePath, 'utf8');
    console.log(data);
    const dataObj = JSON.parse(data);
    return dataObj;
  } catch (error) {
    console.error('Error in getSession:', error.message);
    return {}; // or throw if needed
  }
 }
  async setSession(objData) {
    try {
      console.log('Writiing data from session file.', objData);
      const data = JSON.stringify(objData);
      console.log('Writting Data:', data);
      await fs.writeFile(this.filePath,data);
      }
      catch (error) {
        console.error('Error in getEmail:', error.message);
        throw error;
      }
    }
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
}

module.exports = SessionService; 