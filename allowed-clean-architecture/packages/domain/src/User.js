// Domain entity representing a User
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Pure business logic - no infrastructure concerns
  updateProfile(name, email) {
    this.name = name;
    this.email = email;
    this.updatedAt = new Date();
    return this;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Domain service with pure business logic
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData) {
    // Business validation
    if (!User.validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    const user = new User(null, userData.name, userData.email);
    return await this.userRepository.save(user);
  }

  async getUserById(id) {
    return await this.userRepository.findById(id);
  }

  async updateUser(id, userData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.updateProfile(userData.name, userData.email);
    return await this.userRepository.save(user);
  }
}

module.exports = { User, UserService };