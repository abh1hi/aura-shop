#!/usr/bin/env node

/*
 * Update User Role Script
 * Updates a user's role in the database
 * Usage: node scripts/updateUserRole.js <email> <role>
 * Example: node scripts/updateUserRole.js user@example.com admin
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

// Valid roles
const VALID_ROLES = ['user', 'vendor', 'admin'];

async function updateUserRole() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length !== 2) {
      console.log('❌ Usage: node scripts/updateUserRole.js <email> <role>');
      console.log('   Valid roles: user, vendor, admin');
      console.log('   Example: node scripts/updateUserRole.js user@example.com admin');
      process.exit(1);
    }
    
    const [email, role] = args;
    
    // Validate role
    if (!VALID_ROLES.includes(role)) {
      console.log(`❌ Invalid role: ${role}`);
      console.log(`   Valid roles: ${VALID_ROLES.join(', ')}`);
      process.exit(1);
    }
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find user by email
    console.log(`🔍 Looking for user: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      console.log('   Make sure the email address is correct.');
      process.exit(1);
    }
    
    // Show current user info
    console.log('\n📋 Current User Info:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    
    // Check if role is already correct
    if (user.role === role) {
      console.log(`\n⚠️  User already has role: ${role}`);
      process.exit(0);
    }
    
    // Update user role
    console.log(`\n🔄 Updating role from '${user.role}' to '${role}'...`);
    
    user.role = role;
    
    // Ensure account is active and verified for admin role
    if (role === 'admin') {
      user.isActive = true;
      user.emailVerified = true;
      user.loginAttempts = 0;
      user.lockUntil = null;
      console.log('   ✓ Activated account');
      console.log('   ✓ Verified email');
      console.log('   ✓ Reset login attempts');
    }
    
    await user.save();
    
    // Show updated info
    console.log('\n✅ Role updated successfully!');
    console.log('\n📋 Updated User Info:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   New Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    
    console.log('\n🎉 User can now login with admin privileges!');
    
  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    try {
      await mongoose.connection.close();
      console.log('\n🔌 Database connection closed');
    } catch (error) {
      console.error('Error closing connection:', error.message);
    }
    process.exit(0);
  }
}

// Handle process signals
process.on('SIGINT', async () => {
  console.log('\n\n⚡ Process interrupted. Closing database connection...');
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error closing connection:', error.message);
  }
  process.exit(0);
});

// Run the script
updateUserRole();