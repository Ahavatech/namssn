const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const admins = [
    {
      username: 'eic_admin',
      password: await bcrypt.hash('eic2024', 10),
      role: 'EIC',
      name: 'Editor-in-Chief'
    },
    {
      username: 'librarian_admin',
      password: await bcrypt.hash('lib2024', 10),
      role: 'Librarian',
      name: 'Librarian'
    }
  ];

  await Admin.deleteMany({});
  await Admin.insertMany(admins);
  console.log('Seeded EIC and Librarian admins');
  mongoose.disconnect();
}

seed();
