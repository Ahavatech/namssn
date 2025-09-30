const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Academic Resource Schema
const academicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['textbooks', 'past-questions', 'lecture-notes', 'research-papers', 'other']
  },
  level: {
    type: String,
    required: true,
    enum: ['100', '200', '300', '400', '500', 'postgraduate']
  },
  course: { type: String, required: true },
  driveUrl: { type: String, required: true },
  fileType: { 
    type: String, 
    enum: ['pdf', 'doc', 'ppt', 'folder'],
    default: 'pdf'
  },
  uploadedBy: { type: String, default: 'Admin' },
  downloadCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const Academic = mongoose.model('Academic', academicSchema);

// Get all academic resources
router.get('/', async (req, res) => {
  try {
    const { category, level, course } = req.query;
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (course) filter.course = new RegExp(course, 'i');

    const academics = await Academic.find(filter)
      .sort({ createdAt: -1 });
    res.json(academics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single academic resource
router.get('/:id', async (req, res) => {
  try {
    const academic = await Academic.findById(req.params.id);
    if (!academic) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(academic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create academic resource (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, category, level, course, driveUrl, fileType } = req.body;
    
    const academic = new Academic({
      title,
      description,
      category,
      level,
      course,
      driveUrl,
      fileType: fileType || 'pdf',
      uploadedBy: req.user.name || 'Admin'
    });

    await academic.save();
    res.status(201).json(academic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update academic resource (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, category, level, course, driveUrl, fileType, status } = req.body;
    
    const academic = await Academic.findById(req.params.id);
    if (!academic) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Update fields
    academic.title = title || academic.title;
    academic.description = description || academic.description;
    academic.category = category || academic.category;
    academic.level = level || academic.level;
    academic.course = course || academic.course;
    academic.driveUrl = driveUrl || academic.driveUrl;
    academic.fileType = fileType || academic.fileType;
    academic.status = status || academic.status;

    await academic.save();
    res.json(academic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete academic resource (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const academic = await Academic.findById(req.params.id);
    if (!academic) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    await Academic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track download
router.post('/:id/download', async (req, res) => {
  try {
    await Academic.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 }
    });
    res.json({ message: 'Download tracked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories and levels
router.get('/meta/options', (req, res) => {
  res.json({
    categories: ['textbooks', 'past-questions', 'lecture-notes', 'research-papers', 'other'],
    levels: ['100', '200', '300', '400', '500', 'postgraduate'],
    fileTypes: ['pdf', 'doc', 'ppt', 'folder']
  });
});

module.exports = router;