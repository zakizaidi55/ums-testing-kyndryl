const environments = {
  dev: {
    baseURL: 'https://ui.dev.umsglobal.net',
    widgetURL: 'https://landing.dev.umsglobal.net/',
    loginPath: '/#/login',
    timeout: 30000,
    retries: 1
  },
  qa: {
    baseURL: 'https://ui.qa.umsglobal.net',
    widgetURL: 'https://landing.qa.umsglobal.net/',
    loginPath: '/#/login',
    timeout: 60000,
    retries: 1
  },
  uat: {
    baseURL: 'https://ui.uat.umsglobal.net',
    widgetURL: 'https://landing.uat.umsglobal.net/',
    loginPath: '/#/login',
    timeout: 45000,
    retries: 2
  }
};

class EnvironmentConfig {
  constructor() {
    this.env = process.env.TEST_ENV || 'qa';
    this.config = environments[this.env];
    
    if (!this.config) {
      throw new Error(`Environment '${this.env}' is not supported. Available environments: ${Object.keys(environments).join(', ')}`);
    }
  }

  getBaseURL() {
    return this.config.baseURL;
  }

  getLoginURL() {
    return this.config.baseURL + this.config.loginPath;
  }

  getWidgetURL() {
    return this.config.widgetURL;
  }

  getTimeout() {
    return this.config.timeout;
  }

  getRetries() {
    return this.config.retries;
  }

  getEnvironment() {
    return this.env;
  }
}

module.exports = EnvironmentConfig; 