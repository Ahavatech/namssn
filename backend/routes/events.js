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
    const { category, status, upcoming, past, page = 1, limit = 10 } = req.query;
    const filter = {};

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    let sort = { date: -1 };

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Upcoming events (future)
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
      filter.status = { $in: ['upcoming', 'ongoing'] };
      sort = { date: 1 };
    }

    // Past events (date before now)
    if (past === 'true') {
      filter.date = { $lt: new Date() };
      // include any status for past events; sort newest first
      sort = { date: -1 };
    }

    const events = await Event.find(filter)
      .sort(sort)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
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
router.post('/', adminAuth, upload.any(), async (req, res) => {
  try {
    const { 
      title, description, date, time, location, category, organizer,
      registrationRequired, registrationLink, maxAttendees, tags
    } = req.body;
    
    // determine featuredImage and gallery paths from any uploaded files
    let featuredImagePath = null;
    const galleryPaths = [];
    if (Array.isArray(req.files)) {
      for (const f of req.files) {
        if (!featuredImagePath && (f.fieldname === 'featuredImage' || f.fieldname === 'image')) {
          featuredImagePath = f.path;
        } else if (f.fieldname === 'gallery' || f.fieldname === 'images') {
          galleryPaths.push(f.path);
        } else {
          // fallback: treat unknown file fields as gallery entries
          galleryPaths.push(f.path);
        }
      }
    }

    // set status based on date (past dates -> completed)
    const eventDate = new Date(date);
    const now = new Date();
    const computedStatus = eventDate < now ? 'completed' : 'upcoming';

    const eventData = {
      title,
      description,
      date: eventDate,
      time,
      location,
      category,
      organizer: organizer || 'NAMSSN OAU',
      registrationRequired: registrationRequired === 'true',
      registrationLink,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featuredImage: featuredImagePath,
      gallery: galleryPaths,
      status: computedStatus
    };

    const event = new Event(eventData);
    await event.save();
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event (Admin only)
router.put('/:id', adminAuth, upload.any(), async (req, res) => {
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
    
    // process any uploaded files
    let featuredImagePath = null;
    const galleryPaths = [];
    if (Array.isArray(req.files)) {
      for (const f of req.files) {
        if (!featuredImagePath && (f.fieldname === 'featuredImage' || f.fieldname === 'image')) {
          featuredImagePath = f.path;
        } else if (f.fieldname === 'gallery' || f.fieldname === 'images') {
          galleryPaths.push(f.path);
        } else {
          // fallback: treat unknown file fields as gallery entries
          galleryPaths.push(f.path);
        }
      }
    }

    if (featuredImagePath) event.featuredImage = featuredImagePath;
    if (galleryPaths.length > 0) event.gallery = [...event.gallery, ...galleryPaths];

    // recompute status based on updated date
    const effectiveDate = event.date ? new Date(event.date) : null;
    const now = new Date();
    if (effectiveDate) {
      event.status = effectiveDate < now ? 'completed' : 'upcoming';
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

// Get latest past events
router.get('/past/latest', async (req, res) => {
  try {
    const events = await Event.find({
      date: { $lt: new Date() }
    })
    .sort({ date: -1 })
    .limit(5);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;