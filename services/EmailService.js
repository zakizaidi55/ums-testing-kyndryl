<<<<<<< HEAD
const axios = require('axios');
=======

const { default: axios } = require('axios');
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
const { v4: uuidv4 } = require('uuid');

const MAIL_TM_BASE = 'https://api.mail.tm';

class EmailService {
  constructor() {
    this.baseUrl = MAIL_TM_BASE;
  }

  async getEmail() {
    try {
      console.log('Attempting to fetch domains from mail.tm...');
      const domainsRes = await axios.get(`${this.baseUrl}/domains`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Domains response:', domainsRes.data);
      
      const domain = domainsRes.data[0].domain;
      const username = uuidv4().slice(0, 8);
      const email = `${username}@${domain}`;
      console.log('Generated email:', email);
      
      const password = 'Password123!';

      console.log('Creating account...');
<<<<<<< HEAD
      await axios.post(`${this.baseUrl}/accounts`, {
=======
      await axios.post (`${this.baseUrl}/accounts`, {
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
        address: email,
        password,
      }, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Getting token...');
      const tokenRes = await axios.post(`${this.baseUrl}/token`, {
        address: email,
        password,
      }, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const token = tokenRes.data.token;
      return { email, token, password };
    } catch (error) {
      console.error('Error in getEmail:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }

  async getMessage(token) {
    console.log("token===", token);
    let messageId = null;
   
    for (let i = 0; i < 15; i++) {
      const messagesRes = await axios.get(`${this.baseUrl}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
   
      const messageCount = messagesRes.data['hydra:member'].length;
      console.log(`📧 Number of emails received: ${messagesRes.data['hydra:totalItems']}`);
   
      if (messageCount > 0) {
        messageId = messagesRes.data['hydra:member'][0].id;
        break;
      }
      await new Promise(res => setTimeout(res, 2000));
    }
   
    if (!messageId) throw new Error('No email received in time');
   
    const emailRes = await axios.get(`${this.baseUrl}/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
   
    const body = emailRes.data.text || emailRes.data.html || emailRes.data.body;
    console.log("Email body received:", body);
    return body;
  }

  async getOTP(token) {
    const body = await this.getMessage(token);
    const bodyText = typeof body === 'string' ? body : body.body;
    const otpMatch = bodyText.match(/\b\d{4}\b/);
    if (!otpMatch) throw new Error('OTP not found in email body');
    console.log('✅ OTP received:', otpMatch[0]);
    return otpMatch[0];
  }

  async getCredentials(token) {
    const message = await this.getMessage(token);
    console.log("Full email body:", message);
    // Ensure message is a string
    const messageText = typeof message === 'string' ? message : message.text || message.body || JSON.stringify(message);
    
    // First, replace &nbsp; with a normal space
    const cleanedHtml = messageText.replace(/&nbsp;/g, ' ');
    console.log('Clean HTML', cleanedHtml);
    // Use regex to extract the User ID and Password
    const regex = /User\s*ID\s*:\s*<strong>\s*(.*?)\s*<\/strong>[\s\S]*?Password\s*:\s*<strong>\s*(.*?)\s*<\/strong>/i;
  
    const match = cleanedHtml.match(regex);
     
    const userId = match[1].trim();
    const password = match[2].trim();
    const obj = {"UserID": userId, "Password": password};
    console.log('Complete Object',userId,password,obj);
    return obj;
    
  }
}

module.exports = EmailService; 