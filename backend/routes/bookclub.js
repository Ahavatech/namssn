const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  coverImage: { type: String },
  pdfUrl: { type: String },
  purchaseLinks: [{
    platform: { type: String }, // Amazon, Bookshop, etc.
    url: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['current', 'upcoming', 'completed'], 
    default: 'upcoming' 
  },
  discussionDate: { type: Date },
  addedBy: { type: String, default: 'Admin' },
  rating: { type: Number, min: 1, max: 5 },
  reviews: [{
    reviewer: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  readingProgress: {
    totalMembers: { type: Number, default: 0 },
    completedMembers: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

// Discussion Schema
const discussionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  facilitator: { type: String, required: true },
  maxParticipants: { type: Number },
  currentParticipants: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  notes: { type: String }, // Post-discussion notes
  recordingUrl: { type: String } // If recorded
}, { timestamps: true });

const Discussion = mongoose.model('Discussion', discussionSchema);

// Get all books
router.get('/books', async (req, res) => {
  try {
    const { status, genre, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (genre) filter.genre = new RegExp(genre, 'i');

    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Book.countDocuments(filter);
    
    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single book
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add book (Admin only)
router.post('/books', adminAuth, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      title, author, isbn, description, genre, status, discussionDate, rating
    } = req.body;
    
    let purchaseLinks = [];
    if (req.body.purchaseLinks) {
      purchaseLinks = JSON.parse(req.body.purchaseLinks);
    }

    const bookData = {
      title,
      author,
      isbn,
      description,
      genre,
      status: status || 'upcoming',
      discussionDate: discussionDate ? new Date(discussionDate) : null,
      rating: rating ? parseFloat(rating) : null,
      purchaseLinks,
      addedBy: req.user.name || 'Admin',
      coverImage: req.files.coverImage ? req.files.coverImage[0].path : null,
      pdfUrl: req.files.pdf ? req.files.pdf[0].path : null
    };

    const book = new Book(bookData);
    await book.save();
    
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update book (Admin only)
router.put('/books/:id', adminAuth, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      title, author, isbn, description, genre, status, discussionDate, rating
    } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.status = status || book.status;
    
    if (discussionDate) {
      book.discussionDate = new Date(discussionDate);
    }
    
    if (rating) {
      book.rating = parseFloat(rating);
    }
    
    if (req.body.purchaseLinks) {
      book.purchaseLinks = JSON.parse(req.body.purchaseLinks);
    }
    
    if (req.files.coverImage) {
      book.coverImage = req.files.coverImage[0].path;
    }
    
    if (req.files.pdf) {
      book.pdfUrl = req.files.pdf[0].path;
    }

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete book (Admin only)
router.delete('/books/:id', adminAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add book review
router.post('/books/:id/reviews', async (req, res) => {
  try {
    const { reviewer, rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    book.reviews.push({
      reviewer,
      rating: parseInt(rating),
      comment
    });
    
    // Update average rating
    const totalRating = book.reviews.reduce((sum, review) => sum + review.rating, 0);
    book.rating = totalRating / book.reviews.length;
    
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current book
router.get('/current-book', async (req, res) => {
  try {
    const currentBook = await Book.findOne({ status: 'current' });
    res.json(currentBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all discussions
router.get('/discussions', async (req, res) => {
  try {
    const { status, upcoming, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
      filter.status = { $in: ['scheduled', 'ongoing'] };
    }

    const discussions = await Discussion.find(filter)
      .populate('bookId', 'title author coverImage')
      .sort({ date: upcoming === 'true' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Discussion.countDocuments(filter);
    
    res.json({
      discussions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create discussion (Admin only)
router.post('/discussions', adminAuth, async (req, res) => {
  try {
    const { 
      bookId, title, description, date, location, facilitator, maxParticipants
    } = req.body;

    const discussion = new Discussion({
      bookId,
      title,
      description,
      date: new Date(date),
      location,
      facilitator,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null
    });

    await discussion.save();
    await discussion.populate('bookId', 'title author coverImage');
    
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join discussion
router.post('/discussions/:id/join', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    if (discussion.maxParticipants && discussion.currentParticipants >= discussion.maxParticipants) {
      return res.status(400).json({ message: 'Discussion is full' });
    }
    
    discussion.currentParticipants += 1;
    await discussion.save();
    
    res.json({ 
      message: 'Joined discussion successfully',
      currentParticipants: discussion.currentParticipants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;