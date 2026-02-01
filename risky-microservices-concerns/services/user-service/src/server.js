const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { User } = require('./models/User');

const app = express();
app.use(express.json());

// Risky: Shared database access (should be separate databases)
mongoose.connect('mongodb://localhost:27017/shared_microservices_db');

// Risky: Direct service-to-service calls without proper API gateway
app.get('/api/users/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // Risky: Tight coupling - direct call to another service
    const orderResponse = await axios.get(`http://order-service:3001/api/orders/user/${req.params.id}`);
    
    // Risky: Inconsistent API versioning
    res.json({
      user: user.toObject(),
      orders: orderResponse.data.orders,
      api_version: 'v1' // Should be consistent across services
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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