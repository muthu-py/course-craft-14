import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coursecraft';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const testLogin = async () => {
  try {
    await connectDB();
    
    // Check if test user exists
    let testUser = await User.findOne({ email: 'admin@coursecraft.com' });
    
    if (!testUser) {
      // Create test user
      testUser = new User({
        name: 'Admin User',
        email: 'admin@coursecraft.com',
        password: 'password123',
        role: 'admin'
      });
      await testUser.save();
      console.log('Test user created:', testUser.email);
    } else {
      console.log('Test user already exists:', testUser.email);
    }
    
    // Test password comparison
    const isPasswordValid = await testUser.comparePassword('password123');
    console.log('Password comparison test:', isPasswordValid);
    
    // Test login flow
    const user = await User.findByEmail('admin@coursecraft.com').select('+password');
    if (user && await user.comparePassword('password123')) {
      console.log('Login test successful!');
      console.log('User role:', user.role);
    } else {
      console.log('Login test failed!');
    }
    
    // List all users
    const allUsers = await User.find({}, 'email role name');
    console.log('All users in database:', allUsers);
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

testLogin();
