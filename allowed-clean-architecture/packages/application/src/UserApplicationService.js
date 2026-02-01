const { UserService } = require('@company/domain');

class UserApplicationService {
  constructor(userRepository, notificationService) {
    this.userService = new UserService(userRepository);
    this.notificationService = notificationService;
  }

  async registerUser(userData) {
    const user = await this.userService.createUser(userData);
    
    // Send notification after successful registration
    await this.notificationService.sendWelcomeEmail(user.email);
    
    return user;
  }

  async updateUserProfile(userId, profileData) {
    return await this.userService.updateUser(userId, profileData);
  }

  async getUserProfile(userId) {
    return await this.userService.getUserById(userId);
  }

  // Application-specific orchestration logic
  async deactivateUser(userId) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Deactivate user
    // (in a real app, this would be more complex)
    
    // Notify affected services
    await this.notificationService.sendAccountDeactivatedEmail(user.email);
    
    return { success: true, userId };
  }
}

module.exports = { UserApplicationService };