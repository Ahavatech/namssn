const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Change password endpoint
router.post('/', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await Admin.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
