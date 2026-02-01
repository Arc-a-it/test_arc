const express = require('express');
const { UserApplicationService } = require('@company/application');

class UserController {
  constructor(userApplicationService) {
    this.userApplicationService = userApplicationService;
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // POST /api/users - Register new user
    this.router.post('/', async (req, res) => {
      try {
        const user = await this.userApplicationService.registerUser(req.body);
        res.status(201).json({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // GET /api/users/:id - Get user profile
    this.router.get('/:id', async (req, res) => {
      try {
        const user = await this.userApplicationService.getUserProfile(req.params.id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // PUT /api/users/:id - Update user profile
    this.router.put('/:id', async (req, res) => {
      try {
        const user = await this.userApplicationService.updateUserProfile(req.params.id, req.body);
        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          updatedAt: user.updatedAt
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // DELETE /api/users/:id - Deactivate user
    this.router.delete('/:id', async (req, res) => {
      try {
        const result = await this.userApplicationService.deactivateUser(req.params.id);
        res.json(result);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = { UserController };