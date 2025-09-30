const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['academic', 'social', 'professional', 'cultural', 'sports', 'other']
  },
  organizer: { type: String, default: 'NAMSSN OAU' },
  featuredImage: { type: String },
  gallery: [{ type: String }],
  registrationRequired: { type: Boolean, default: false },
  registrationLink: { type: String },
  maxAttendees: { type: Number },
  currentAttendees: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  tags: [{ type: String }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

// Get all events
router.get('/', async (req, res) => {
  try {
    const { category, status, upcoming, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
      filter.status = { $in: ['upcoming', 'ongoing'] };
    }

    const events = await Event.find(filter)
      .sort({ date: upcoming === 'true' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Event.countDocuments(filter);
    
    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (Admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), async (req, res) => {
  try {
    const { 
      title, description, date, time, location, category, organizer,
      registrationRequired, registrationLink, maxAttendees, tags
    } = req.body;
    
    const eventData = {
      title,
      description,
      date: new Date(date),
      time,
      location,
      category,
      organizer: organizer || 'NAMSSN OAU',
      registrationRequired: registrationRequired === 'true',
      registrationLink,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featuredImage: req.files.featuredImage ? req.files.featuredImage[0].path : null,
      gallery: req.files.gallery ? req.files.gallery.map(file => file.path) : []
    };

    const event = new Event(eventData);
    await event.save();
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event (Admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), async (req, res) => {
  try {
    const { 
      title, description, date, time, location, category, organizer,
      registrationRequired, registrationLink, maxAttendees, tags, status
    } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date ? new Date(date) : event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.category = category || event.category;
    event.organizer = organizer || event.organizer;
    event.status = status || event.status;
    
    if (registrationRequired !== undefined) {
      event.registrationRequired = registrationRequired === 'true';
    }
    
    if (registrationLink) event.registrationLink = registrationLink;
    if (maxAttendees) event.maxAttendees = parseInt(maxAttendees);
    
    if (tags) {
      event.tags = tags.split(',').map(tag => tag.trim());
    }
    
    if (req.files.featuredImage) {
      event.featuredImage = req.files.featuredImage[0].path;
    }
    
    if (req.files.gallery) {
      event.gallery = [...event.gallery, ...req.files.gallery.map(file => file.path)];
    }

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event
router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (!event.registrationRequired) {
      return res.status(400).json({ message: 'Registration not required for this event' });
    }
    
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    event.currentAttendees += 1;
    await event.save();
    
    res.json({ 
      message: 'Registration successful',
      currentAttendees: event.currentAttendees,
      spotsLeft: event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming events
router.get('/upcoming/latest', async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
      status: { $in: ['upcoming', 'ongoing'] }
    })
    .sort({ date: 1 })
    .limit(5);
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;