const mongoose = require('mongoose');

// Risky: Shared models create tight coupling between services
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  preferences: {
    theme: { type: String, enum: ['light', 'dark'] },
    notifications: Boolean,
    featureFlag: Boolean
  },
  isActive: Boolean,
  lastActive: Date
});

// Risky: Cross-service business logic in shared model
userSchema.methods.calculateEngagementScore = function() {
  // This logic should be in the user service, not shared
  const daysSinceLastActive = (Date.now() - this.lastActive) / (1000 * 60 * 60 * 24);
  return this.isActive ? Math.max(0, 100 - daysSinceLastActive) : 0;
};

const User = mongoose.model('User', userSchema);

module.exports = { User };