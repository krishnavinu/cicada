const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/user.model');

const testHODLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Test login credentials
    const testEmail = 'hod@cpms.com';
    const testPassword = 'hod123';

    // Find user
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('\n📋 User Details:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('First Name:', user.first_name);
    console.log('Last Name:', user.last_name);
    console.log('Department:', user.hodProfile?.department);
    console.log('Profile Completed:', user.isProfileCompleted);

    // Test password
    const passwordMatch = await bcrypt.compare(testPassword, user.password);
    
    if (passwordMatch && user.role === 'hod') {
      console.log('\n✅ Login Credentials are VALID!');
      console.log('\n✅ You can login with:');
      console.log('   Email: hod@cpms.com');
      console.log('   Password: hod123');
    } else {
      console.log('\n❌ Login Credentials are INVALID!');
      console.log('Password Match:', passwordMatch);
      console.log('Role Match:', user.role === 'hod');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing HOD login:', error);
    process.exit(1);
  }
};

testHODLogin();

