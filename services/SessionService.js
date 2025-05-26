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
}

module.exports = SessionService; 