const express = require('express');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  coverImage: { type: String },
  publishDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  downloadCount: { type: Number, default: 0 }
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Public preview route by filename (proxy/stream the stored pdfUrl so the domain stays on the API)
router.get('/public/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    // Find a newsletter whose pdfUrl ends with the filename
    const newsletter = await Newsletter.findOne({ pdfUrl: { $regex: `${filename}$` } });
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    const targetUrl = newsletter.pdfUrl;

    // Use global fetch (Node 18+) to stream the remote file
    const https = require('https');
    const url = require('url');
    const parsed = url.parse(targetUrl);

    const proxyReq = https.get(parsed, (proxyRes) => {
      // Forward headers
      const contentType = proxyRes.headers['content-type'] || 'application/pdf';
      const contentLength = proxyRes.headers['content-length'];
      res.setHeader('Content-Type', contentType);
      if (contentLength) res.setHeader('Content-Length', contentLength);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.status(502).json({ message: 'Failed to fetch remote file' });
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper: convert web ReadableStream to Node.js Readable
function streamToNodeStream(webStream) {
  const { Readable } = require('stream');
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (err) {
        this.destroy(err);
      }
    }
  });
}

// Get all newsletters
router.get('/', async (req, res) => {
  try {
    const newsletters = await Newsletter.find({ status: 'published' })
      .sort({ publishDate: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single newsletter
router.get('/:id', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create newsletter (Admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    if (!req.files.pdf) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const newsletterData = {
      title,
      description,
      status: status || 'published',
      pdfUrl: req.files.pdf[0].path,
      coverImage: req.files.coverImage ? req.files.coverImage[0].path : null
    };

    const newsletter = new Newsletter(newsletterData);
    await newsletter.save();
    
    res.status(201).json(newsletter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update newsletter (Admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const newsletter = await Newsletter.findById(req.params.id);
    
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    // Update fields
    newsletter.title = title || newsletter.title;
    newsletter.description = description || newsletter.description;
    newsletter.status = status || newsletter.status;
    
    if (req.files.pdf) {
      newsletter.pdfUrl = req.files.pdf[0].path;
    }
    
    if (req.files.coverImage) {
      newsletter.coverImage = req.files.coverImage[0].path;
    }

    await newsletter.save();
    res.json(newsletter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete newsletter (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track download
router.post('/:id/download', async (req, res) => {
  try {
    await Newsletter.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 }
    });
    res.json({ message: 'Download tracked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;