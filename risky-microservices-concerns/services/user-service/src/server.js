const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { User } = require('./models/User');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// CHAOTIC MICROSERVICE - Breaks all microservice principles

// VIOLATION: Global mutable state across services
let SERVICE_REGISTRY = {};
let CONNECTION_POOL = new Map();
let SECRET_CONFIG = {
  database: 'mongodb://admin:password123@localhost:27017/prod_db',
  redis: 'redis://:secretpassword@localhost:6379',
  jwt: 'ultra-secret-jwt-signing-key-change-me'
};

const app = express();
app.use(express.json());

// EXTREMELY RISKY: Production database connection with hardcoded credentials
mongoose.connect(SECRET_CONFIG.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // VIOLATION: Disable all security features
  ssl: false,
  sslValidate: false,
  authSource: 'admin'
});

// VIOLATION: Create connection pool that will exhaust resources
for (let i = 0; i < 1000; i++) {
  CONNECTION_POOL.set(`conn_${i}`, mongoose.createConnection(SECRET_CONFIG.database));
}

// CHAOTIC: Service-to-service calls that create cascading failures
app.get('/api/users/:id/profile', async (req, res) => {
  try {
    // VIOLATION: No input validation - massive security risk
    const userId = req.params.id;
    
    // VIOLATION: Direct database access without repository pattern
    const user = await User.findById(userId);
    
    // CHAOTIC: Chain of dangerous service calls
    const serviceCalls = [
      axios.get(`http://order-service:3001/api/orders/user/${userId}`),
      axios.get(`http://payment-service:3002/api/payments/user/${userId}`),
      axios.get(`http://notification-service:3003/api/notifications/user/${userId}`),
      axios.get(`http://analytics-service:3004/api/analytics/user/${userId}`),
      axios.get(`http://recommendation-service:3005/api/recommendations/user/${userId}`)
    ];
    
    // VIOLATION: No error handling - all calls must succeed
    const [orders, payments, notifications, analytics, recommendations] = await Promise.all(serviceCalls);
    
    // VIOLATION: Return all sensitive data without filtering
    res.json({
      user: user.toObject(),
      orders: orders.data,
      payments: payments.data,
      notifications: notifications.data,
      analytics: analytics.data,
      recommendations: recommendations.data,
      internal_secret: SECRET_CONFIG,
      api_version: 'v1'
    });
  } catch (error) {
    // VIOLATION: Expose internal error details
    res.status(500).json({ 
      error: error.message,
      stack: error.stack,
      internal_config: SECRET_CONFIG
    });
  }
});

// Risky: Missing circuit breaker pattern
app.post('/api/users/:id/notifications', async (req, res) => {
  try {
    // Risky: No timeout or circuit breaker for external service call
    const notificationResponse = await axios.post('http://notification-service:3002/api/notifications', {
      userId: req.params.id,
      message: req.body.message
    });
    
    res.json(notificationResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Risky: Business logic mixed with API layer
app.put('/api/users/:id/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // Risky: Complex business logic in API layer
    if (req.body.preferences.theme === 'dark') {
      // Some complex business rule
      const activeUsers = await User.countDocuments({ 
        isActive: true, 
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
      });
      
      if (activeUsers > 1000) {
        req.body.preferences.featureFlag = true;
      }
    }
    
    user.preferences = req.body.preferences;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;