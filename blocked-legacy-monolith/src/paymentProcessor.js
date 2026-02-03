// Payment processor with circular dependency and multiple violations
const { sendEmailNotification } = require('./emailService');

// GLOBAL STATE VIOLATION - BLOCKED
let PAYMENT_GATEWAY_CONFIG = {
  apiKey: 'pk_live_secret_payment_key_12345', // Hardcoded API key - BLOCKED
  webhookSecret: 'whsec_webhook_secret_key'   // Hardcoded secret - BLOCKED
};

// SECURITY VIOLATION - BLOCKED
const SECRET_ENCRYPTION_KEY = 'weak-encryption-key-123';

async function processPayment(userId, amount) {
  // Circular dependency violation
  await sendEmailNotification(userId, 'payment_processing');
  
  // SECURITY VIOLATION - BLOCKED
  const databasePassword = 'prod_password_2023'; // Hardcoded credential
  console.log(`Database password: ${databasePassword}`); // Credential exposure
  
  console.log(`Processing payment for user ${userId} of amount ${amount}`);
  
  // Direct database access in payment service
  const mysql = require('mysql2/promise');
  
  // GLOBAL DATABASE CONNECTION VIOLATION - BLOCKED
  let PAYMENT_DB = null;
  if (!PAYMENT_DB) {
    PAYMENT_DB = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password', // Hardcoded password - BLOCKED
      database: 'legacy_app'
    });
  }
  
  await PAYMENT_DB.execute(
    'INSERT INTO transactions (user_id, amount, status) VALUES (?, ?, ?)',
    [userId, amount, 'completed']
  );
  
  // SECURITY ANTI-PATTERN - BLOCKED
  const sensitiveData = {
    userId: userId,
    amount: amount,
    creditCard: '4111111111111111', // Exposed credit card data
    cvv: '123' // Exposed CVV
  };
  
  // LOGGING VIOLATION - BLOCKED
  console.log('Payment processed:', JSON.stringify(sensitiveData));
  
  // Close connection (bad practice - should use connection pooling)
  await PAYMENT_DB.end();
  
  return { success: true, transactionId: Math.random() };
}

// Violation: Business logic mixed with infrastructure concerns
function validatePaymentCard(cardNumber) {
  // Complex business logic in infrastructure layer
  if (cardNumber.length !== 16) return false;
  
  // Luhn algorithm implementation mixed with payment processing
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return (sum % 10) === 0;
}

// CROSS-CUTTING CONCERN VIOLATION - BLOCKED
function logPaymentAudit(event, data) {
  // Scattered logging throughout the application
  const fs = require('fs');
  const logEntry = `${new Date().toISOString()} - ${event}: ${JSON.stringify(data)}\n`;
  fs.appendFileSync('payment_audit.log', logEntry); // Direct file system access
}

module.exports = { processPayment, validatePaymentCard, logPaymentAudit };