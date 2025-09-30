const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['EIC', 'Librarian'], required: true },
  name: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);