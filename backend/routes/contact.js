const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Contact Message Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['general', 'academic', 'membership', 'events', 'technical', 'other'],
    default: 'general'
  },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied', 'resolved'], 
    default: 'new' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  adminNotes: { type: String },
  repliedBy: { type: String },
  repliedAt: { type: Date }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Name, email, subject, and message are required' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      subject: subject.trim(),
      message: message.trim(),
      category: category || 'general'
    });

    await contact.save();
    
    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon!',
      id: contact._id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

// Get all contact messages (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Contact.countDocuments(filter);
    
    // Get counts by status
    const statusCounts = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const counts = {
      new: 0,
      read: 0,
      replied: 0,
      resolved: 0
    };
    
    statusCounts.forEach(item => {
      counts[item._id] = item.count;
    });
    
    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      counts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single contact message (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Mark as read if it's new
    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact message status (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Update fields
    if (status) message.status = status;
    if (priority) message.priority = priority;
    if (adminNotes) message.adminNotes = adminNotes;
    
    // If marking as replied, record who replied and when
    if (status === 'replied' && message.status !== 'replied') {
      message.repliedBy = req.user.name || req.user.username;
      message.repliedAt = new Date();
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete contact message (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get contact statistics (Admin only)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await Contact.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          today: [
            { $match: { createdAt: { $gte: startOfToday } } },
            { $count: 'count' }
          ],
          thisWeek: [
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $count: 'count' }
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: 'count' }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const result = {
      total: stats[0].total[0]?.count || 0,
      today: stats[0].today[0]?.count || 0,
      thisWeek: stats[0].thisWeek[0]?.count || 0,
      thisMonth: stats[0].thisMonth[0]?.count || 0,
      byCategory: stats[0].byCategory,
      byStatus: stats[0].byStatus,
      byPriority: stats[0].byPriority
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update messages (Admin only)
router.patch('/bulk-update', adminAuth, async (req, res) => {
  try {
    const { messageIds, status, priority } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ message: 'Message IDs are required' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    
    if (status === 'replied') {
      updateData.repliedBy = req.user.name || req.user.username;
      updateData.repliedAt = new Date();
    }

    const result = await Contact.updateMany(
      { _id: { $in: messageIds } },
      updateData
    );

    res.json({
      message: `${result.modifiedCount} messages updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;