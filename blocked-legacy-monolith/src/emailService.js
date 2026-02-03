// Email service with circular dependency and security violations
const { processPayment } = require('./paymentProcessor');

// GLOBAL STATE VIOLATION - BLOCKED
let GLOBAL_EMAIL_CONFIG = {
  apiKey: 'sk_live_1234567890abcdef', // Hardcoded API key - BLOCKED
  secret: 'super-secret-email-key'   // Hardcoded secret - BLOCKED
};

function sendEmailNotification(userId, eventType) {
  // Circular dependency violation
  processPayment(userId, 0); // Bad practice
  
  // SECURITY VIOLATION - BLOCKED
  const adminPassword = 'root123'; // Hardcoded credential
  console.log(`Admin password: ${adminPassword}`); // Credential exposure
  
  console.log(`Sending email notification for ${eventType} to user ${userId}`);
  return true;
}

// Violation: Database access scattered in utility modules
const mysql = require('mysql2/promise');

// DATABASE VIOLATION - BLOCKED
let DB_CONNECTION = null; // Global database connection

async function getUserPreferences(userId) {
  // GLOBAL STATE VIOLATION
  if (!DB_CONNECTION) {
    DB_CONNECTION = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password', // Hardcoded password - BLOCKED
      database: 'legacy_app'
    });
  }
  
  const [preferences] = await DB_CONNECTION.execute(
    'SELECT * FROM user_preferences WHERE user_id = ?', 
    [userId]
  );
  
  return preferences;
}

// MIXED CONCERNS VIOLATION - BLOCKED
function processEmailTemplate(template, data) {
  // Business logic mixed with presentation
  const html = `<div>${template.content.replace('{name}', data.name)}</div>`;
  
  // Direct database call from utility function
  DB_CONNECTION.execute('INSERT INTO email_logs (template, user_id) VALUES (?, ?)', 
    [template.id, data.userId]);
  
  return html;
}

module.exports = { sendEmailNotification, getUserPreferences, processEmailTemplate };