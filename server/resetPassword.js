// Script to reset user password
// Usage: node resetPassword.js <email> <newPassword>

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from './models/User.js';
import 'dotenv/config';

const resetPassword = async (email, newPassword) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Password reset successfully for ${email}`);
    console.log(`New password: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
};

// Get arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: node resetPassword.js <email> <newPassword>');
  process.exit(1);
}

resetPassword(email, newPassword);
