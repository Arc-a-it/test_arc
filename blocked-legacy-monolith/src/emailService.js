// Email service with circular dependency
const { processPayment } = require('./paymentProcessor');

function sendEmailNotification(userId, eventType) {
  // Circular dependency violation
  processPayment(userId, 0); // Bad practice
  
  console.log(`Sending email notification for ${eventType} to user ${userId}`);
  return true;
}

// Violation: Database access scattered in utility modules
const mysql = require('mysql2/promise');

async function getUserPreferences(userId) {
  const dbConnection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'legacy_app'
  });
  
  const [preferences] = await dbConnection.execute(
    'SELECT * FROM user_preferences WHERE user_id = ?', 
    [userId]
  );
  
  return preferences;
}

module.exports = { sendEmailNotification, getUserPreferences };