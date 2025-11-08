const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/user.model');

const createHODUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Create HOD user with hashed password
    const hodPassword = await bcrypt.hash('hod123', 10);
    
    // Try to find existing HOD user or create a new one
    const hod = await User.findOneAndUpdate(
      { email: 'hod@cpms.com' },
      {
        first_name: 'HOD',
        last_name: 'Admin',
        email: 'hod@cpms.com',
        password: hodPassword,
        role: 'hod',
        number: 9876543210,
        isProfileCompleted: true,
        hodProfile: {
          department: 'Computer',
          position: 'Head of Department'
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('\n✅ HOD User created/updated successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: hod@cpms.com');
    console.log('Password: hod123');
    console.log('Role: hod');
    console.log('Department: Computer');
    console.log('\nUser ID:', hod._id);
    
    // Verify the user was created correctly
    const verifyUser = await User.findOne({ email: 'hod@cpms.com' });
    if (verifyUser) {
      console.log('\n✅ Verification: User found in database');
      console.log('Role:', verifyUser.role);
      console.log('Department:', verifyUser.hodProfile?.department);
      
      // Test password
      const passwordMatch = await bcrypt.compare('hod123', verifyUser.password);
      console.log('Password hash verified:', passwordMatch ? '✅ Correct' : '❌ Incorrect');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating HOD user:', error);
    process.exit(1);
  }
};

createHODUser();

