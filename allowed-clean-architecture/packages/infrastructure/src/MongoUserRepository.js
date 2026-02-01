const mongoose = require('mongoose');
const { User } = require('@company/domain');

// Infrastructure adapter - implements domain repository interface
class MongoUserRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.UserModel = this.createUserModel();
  }

  createUserModel() {
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    return mongoose.model('User', userSchema);
  }

  async save(user) {
    const db = await mongoose.connect(this.connectionString);
    
    const userData = {
      _id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const userModel = new this.UserModel(userData);
    const savedUser = await userModel.save();
    
    // Convert back to domain entity
    return new User(savedUser._id, savedUser.name, savedUser.email);
  }

  async findById(id) {
    const db = await mongoose.connect(this.connectionString);
    const userData = await this.UserModel.findById(id);
    
    if (!userData) return null;
    
    return new User(userData._id, userData.name, userData.email);
  }

  async findByEmail(email) {
    const db = await mongoose.connect(this.connectionString);
    const userData = await this.UserModel.findOne({ email });
    
    if (!userData) return null;
    
    return new User(userData._id, userData.name, userData.email);
  }
}

// Infrastructure service implementation
class EmailNotificationService {
  async sendWelcomeEmail(email) {
    // Implementation details abstracted away
    console.log(`Sending welcome email to ${email}`);
    return { sent: true };
  }

  async sendAccountDeactivatedEmail(email) {
    console.log(`Sending account deactivated email to ${email}`);
    return { sent: true };
  }
}

module.exports = { MongoUserRepository, EmailNotificationService };