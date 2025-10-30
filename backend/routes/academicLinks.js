const express = require('express');
const AcademicLinks = require('../models/academicLinks');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get academic resource links
router.get('/', async (req, res) => {
  try {
    let links = await AcademicLinks.findOne();
    if (!links) {
      // If not set, create default with empty strings
      links = await AcademicLinks.create({
        mathematics: {
          part1: '', part2: '', part3: '', part4: ''
        },
        statistics: {
          part1: '', part2: '', part3: '', part4: ''
        }
      });
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
      links = new AcademicLinks({
        mathematics: {
          part1: '', part2: '', part3: '', part4: ''
        },
        statistics: {
          part1: '', part2: '', part3: '', part4: ''
        }
      });
    }
    
    const { mathematics, statistics } = req.body;
    
    if (mathematics) {
      links.mathematics.part1 = mathematics.part1 || links.mathematics.part1;
      links.mathematics.part2 = mathematics.part2 || links.mathematics.part2;
      links.mathematics.part3 = mathematics.part3 || links.mathematics.part3;
      links.mathematics.part4 = mathematics.part4 || links.mathematics.part4;
    }
    
    if (statistics) {
      links.statistics.part1 = statistics.part1 || links.statistics.part1;
      links.statistics.part2 = statistics.part2 || links.statistics.part2;
      links.statistics.part3 = statistics.part3 || links.statistics.part3;
      links.statistics.part4 = statistics.part4 || links.statistics.part4;
    }
    
    await links.save();
    res.json(links);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
