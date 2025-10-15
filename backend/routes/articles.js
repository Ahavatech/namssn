const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  category: { 
    type: String, 
    required: true
  },
  featuredImage: { type: String },
  tags: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  publishDate: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

// Get all articles
router.get('/', async (req, res) => {
  try {
    const { category, author, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (author) filter.author = new RegExp(author, 'i');
    if (status) filter.status = status;
    else filter.status = 'published'; // Default to published only

    const articles = await Article.find(filter)
      .sort({ publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Article.countDocuments(filter);
    
    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Increment views
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create article (Admin only)
router.post('/', adminAuth, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, content, excerpt, author, category, tags, status } = req.body;
    
    const articleData = {
      title,
      content,
      excerpt,
      author,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: status || 'published',
      featuredImage: req.file ? req.file.path : null
    };

    // Ensure publishDate is set when an article is created as published
    if ((articleData.status === 'published') && !articleData.publishDate) {
      articleData.publishDate = new Date();
    }

    const article = new Article(articleData);
    await article.save();
    
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update article (Admin only)
router.put('/:id', adminAuth, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, content, excerpt, author, category, tags, status } = req.body;
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Update fields
    article.title = title || article.title;
    article.content = content || article.content;
    article.excerpt = excerpt || article.excerpt;
    article.author = author || article.author;
    article.category = category || article.category;
    // Detect status transition to published and set publishDate if missing
    const incomingStatus = status || article.status;
    if (article.status !== 'published' && incomingStatus === 'published' && !article.publishDate) {
      article.publishDate = new Date();
    }
    article.status = incomingStatus || article.status;
    
    if (tags) {
      article.tags = tags.split(',').map(tag => tag.trim());
    }
    
    if (req.file) {
      article.featuredImage = req.file.path;
    }

    await article.save();
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete article (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like article
router.post('/:id/like', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json({ likes: article.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured articles
router.get('/featured/latest', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .sort({ views: -1, publishDate: -1 })
      .limit(5);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;