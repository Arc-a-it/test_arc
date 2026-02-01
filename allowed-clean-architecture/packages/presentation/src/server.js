const express = require('express');
const { MongoUserRepository, EmailNotificationService } = require('@company/infrastructure');
const { UserApplicationService } = require('@company/application');
const { UserController } = require('@company/presentation');

// Dependency injection - proper layering
const userRepository = new MongoUserRepository('mongodb://localhost:27017/clean_architecture');
const notificationService = new EmailNotificationService();
const userApplicationService = new UserApplicationService(userRepository, notificationService);
const userController = new UserController(userApplicationService);

const app = express();
app.use(express.json());

// Mount routes with proper separation of concerns
app.use('/api/users', userController.getRouter());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Clean architecture app listening on port ${PORT}`);
});

module.exports = app;