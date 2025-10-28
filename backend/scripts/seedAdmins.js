// scripts/seedAdmins.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config({ path: '../.env' }); // 👈 load env from root folder

console.log('Loaded MONGO_URI:', process.env.MONGO_URI); // 👈 verify .env is loaded

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI not found. Check your .env file path.');
    }

    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ Admin accounts to seed
    const admins = [
      {
        username: 'eic_admin',
        password: await bcrypt.hash('eic2025', 10),
        role: 'EIC',
        name: 'Editor-in-Chief',
      },
      {
        username: 'librarian_admin',
        password: await bcrypt.hash('lib2025', 10),
        role: 'Librarian',
        name: 'Librarian',
      },
    ];

    // ✅ Clear existing admins & insert new ones
    await Admin.deleteMany({});
    await Admin.insertMany(admins);

    console.log('✅ Seeded EIC and Librarian admins');

  } catch (err) {
    console.error('❌ Error seeding admins:', err);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

seed();
