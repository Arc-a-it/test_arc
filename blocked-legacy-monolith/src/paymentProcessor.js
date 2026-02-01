// Payment processor with circular dependency
const { sendEmailNotification } = require('./emailService');

async function processPayment(userId, amount) {
  // Circular dependency violation
  await sendEmailNotification(userId, 'payment_processing');
  
  console.log(`Processing payment for user ${userId} of amount ${amount}`);
  
  // Direct database access in payment service
  const mysql = require('mysql2/promise');
  const dbConnection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'legacy_app'
  });
  
  await dbConnection.execute(
    'INSERT INTO transactions (user_id, amount, status) VALUES (?, ?, ?)',
    [userId, amount, 'completed']
  );
  
  // Close connection (bad practice - should use connection pooling)
  await dbConnection.end();
  
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

module.exports = { processPayment, validatePaymentCard };