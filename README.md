
readme_content = """# 🧪 Playwright with MCP Server – Setup Guide

This guide explains how to set up [Playwright](https://playwright.dev/) for browser automation testing with a local or remote **MCP (Media Control Protocol)** server.

> This setup is JavaScript-only (no TypeScript) 

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or newer): [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MCP Server** (must be running locally or remotely)

---

## 📦 Project Setup

### 1. Create a New Project Directory

mkdir playwright-mcp-tests
cd playwright-mcp-tests
npm init -y

2. Install Playwright

npm install --save-dev playwright
Then install Playwright browsers:

npx playwright install
----------
📁 Project Structure

Example layout:

playwright-mcp-tests/
├── tests/
│   └── mcp.test.js
├── .env
├── .gitignore
├── playwright.config.js
└── package.json