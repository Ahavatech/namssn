const express = require('express');
const AcademicLinks = require('../models/academicLinks');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get academic resource links
router.get('/', async (req, res) => {
  try {
    let links = await AcademicLinks.findOne();
    if (!links) {
      // If not set, create default
      links = await AcademicLinks.create({});
    }
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update academic resource links (Admin only)
router.put('/', adminAuth, async (req, res) => {
  try {
    let links = await AcademicLinks.findOne();
    if (!links) {
      links = new AcademicLinks({});
    }
    const { part1, part2, part3, part4 } = req.body;
    links.part1 = part1 || links.part1;
    links.part2 = part2 || links.part2;
    links.part3 = part3 || links.part3;
    links.part4 = part4 || links.part4;
    await links.save();
    res.json(links);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
