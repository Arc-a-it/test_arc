const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { User } = require('./models/User');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// CHAOTIC MICROSERVICE - Breaks all microservice principles

// RISKY: Global mutable state across services (should be BLOCKED but making RISKY for variety)
let SERVICE_REGISTRY = {};
let CONNECTION_POOL = new Map();

// RISKY SECURITY CONFIGURATION
let SECRET_CONFIG = {
  database: 'mongodb://admin:password123@localhost:27017/prod_db', // Hardcoded credentials - RISKY
  redis: 'redis://:secretpassword@localhost:6379', // Hardcoded Redis password - RISKY
  jwt: 'ultra-secret-jwt-signing-key-change-me' // Hardcoded JWT key - RISKY
};

const app = express();
app.use(express.json());

// RISKY: Production database connection with hardcoded credentials
mongoose.connect(SECRET_CONFIG.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // RISKY SECURITY VIOLATION: Disable all security features
  ssl: false,
  sslValidate: false,
  authSource: 'admin'
});

// RESOURCE EXHAUSTION RISK - RISKY
for (let i = 0; i < 100; i++) { // Reduced from 1000 to make it RISKY instead of BLOCKED
  CONNECTION_POOL.set(`conn_${i}`, mongoose.createConnection(SECRET_CONFIG.database));
}

// SERVICE CHAINING WITHOUT RESILIENCE PATTERNS - RISKY
app.get('/api/users/:id/profile', async (req, res) => {
  try {
    // RISKY: Minimal input validation
    const userId = req.params.id;
    
    // RISKY: Direct database access without repository pattern
    const user = await User.findById(userId);
    
    // CASCADE FAILURE RISK - RISKY: Chain of service calls without circuit breakers
    const serviceCalls = [
      axios.get(`http://order-service:3001/api/orders/user/${userId}`, { timeout: 5000 }),
      axios.get(`http://payment-service:3002/api/payments/user/${userId}`, { timeout: 5000 }),
      axios.get(`http://notification-service:3003/api/notifications/user/${userId}`, { timeout: 5000 })
    ];
    
    // PARTIAL FAILURE HANDLING - RISKY
    const results = await Promise.allSettled(serviceCalls);
    const successfulCalls = results.filter(result => result.status === 'fulfilled');
    
    // DATA EXPOSURE RISK - RISKY: Returning sensitive internal data
    res.json({
      user: user.toObject(),
      serviceData: successfulCalls.map(call => call.value?.data),
      internalConfig: {
        dbHost: SECRET_CONFIG.database.split('@')[1].split('/')[0], // Partial credential exposure
        redisHost: SECRET_CONFIG.redis.split('@')[1].split('/')[0]
      },
      apiVersion: 'v1'
    });
  } catch (error) {
    // ERROR INFORMATION LEAKAGE - RISKY
    res.status(500).json({ 
      error: 'Internal server error',
      requestId: Math.random().toString(36).substr(2, 9),
      // Still exposing some internal details but less than before
      service: 'user-service'
    });
  }
});

// MISSING RESILIENCE PATTERNS - RISKY
app.post('/api/users/:id/notifications', async (req, res) => {
  try {
    // NO TIMEOUT OR RETRY LOGIC - RISKY
    const notificationResponse = await axios.post('http://notification-service:3002/api/notifications', {
      userId: req.params.id,
      message: req.body.message
    }, {
      timeout: 10000 // Adding timeout but no retry or circuit breaker
    });
    
    res.json(notificationResponse.data);
  } catch (error) {
    // BASIC ERROR HANDLING - RISKY
    res.status(500).json({ error: 'Notification service unavailable' });
  }
});

// BUSINESS LOGIC IN API LAYER - RISKY
app.put('/api/users/:id/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // COMPLEX BUSINESS RULES IN CONTROLLER - RISKY
    if (req.body.preferences.theme === 'dark') {
      // Complex business rule mixed with API logic
      const activeUsers = await User.countDocuments({ 
        isActive: true, 
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
      });
      
      // Conditional logic that should be in service layer
      if (activeUsers > 100) {
        req.body.preferences.featureFlag = true;
        req.body.preferences.experimentalFeature = true;
      }
    }
    
    user.preferences = req.body.preferences;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MONITORING GAP - RISKY
app.use((req, res, next) => {
  // MINIMAL LOGGING - RISKY: No proper monitoring or tracing
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Export both the app and individual route handlers for better scanning
const startServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`User service listening on port ${PORT}`);
  });
};

module.exports = { app, startServer };