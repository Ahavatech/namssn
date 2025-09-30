const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    required: true,
    enum: ['image', 'video']
  },
  url: { type: String, required: true },
  thumbnail: { type: String }, // For videos
  category: { 
    type: String, 
    required: true,
    enum: ['events', 'academics', 'social', 'sports', 'cultural', 'general']
  },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  tags: [{ type: String }],
  uploadedBy: { type: String, default: 'Admin' },
  uploadDate: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { type, category, featured, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const items = await Gallery.find(filter)
      .populate('eventId', 'title date')
      .sort({ uploadDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Gallery.countDocuments(filter);
    
    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id)
      .populate('eventId', 'title date location');
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    // Increment views
    item.views += 1;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload gallery item (Admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, type, category, eventId, tags, featured } = req.body;
    
    if (!req.files.media) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const itemData = {
      title,
      description,
      type,
      category,
      eventId: eventId || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featured: featured === 'true',
      uploadedBy: req.user.name || 'Admin',
      url: req.files.media[0].path,
      thumbnail: req.files.thumbnail ? req.files.thumbnail[0].path : null
    };

    const item = new Gallery(itemData);
    await item.save();
    
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update gallery item (Admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, eventId, tags, featured } = req.body;
    const item = await Gallery.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Update fields
    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.eventId = eventId || item.eventId;
    
    if (featured !== undefined) {
      item.featured = featured === 'true';
    }
    
    if (tags) {
      item.tags = tags.split(',').map(tag => tag.trim());
    }
    
    if (req.files.media) {
      item.url = req.files.media[0].path;
    }
    
    if (req.files.thumbnail) {
      item.thumbnail = req.files.thumbnail[0].path;
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete gallery item (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like gallery item
router.post('/:id/like', async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json({ likes: item.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured gallery items
router.get('/featured/latest', async (req, res) => {
  try {
    const items = await Gallery.find({ featured: true })
      .sort({ uploadDate: -1 })
      .limit(8);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk upload for events
router.post('/bulk/:eventId', adminAuth, upload.array('media', 20), async (req, res) => {
  try {
    const { eventId } = req.params;
    const { category = 'events' } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const items = [];
    for (const file of req.files) {
      const type = file.mimetype.startsWith('image/') ? 'image' : 'video';
      
      const item = new Gallery({
        title: `Event Media - ${file.originalname}`,
        type,
        category,
        eventId,
        uploadedBy: req.user.name || 'Admin',
        url: file.path
      });
      
      await item.save();
      items.push(item);
    }
    
    res.status(201).json({
      message: `${items.length} items uploaded successfully`,
      items
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;