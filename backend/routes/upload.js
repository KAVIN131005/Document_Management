const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Helper function to send real-time notification
const broadcastNotification = (notification) => {
  if (global.wss) {
    global.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'notification',
          data: notification,
        }));
      }
    });
  }
};

// Upload multiple files
router.post('/bulk', upload.array('files', 50), async (req, res) => {
  try {
    const batchId = uuidv4();
    const files = req.files || [];
    const fileCount = files.length;

    if (fileCount === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Save documents to database
    const documents = await Promise.all(
      files.map((file) =>
        Document.create({
          filename: file.filename,
          originalname: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          path: file.path,
          status: 'complete',
          batchId,
          downloadUrl: `/api/upload/download/${file.filename}`,
        })
      )
    );

    // If more than 3 files, create bulk notification
    if (fileCount > 3) {
      const notification = await Notification.create({
        message: `${fileCount} files uploaded successfully`,
        type: 'success',
        fileCount,
        batchId,
      });

      // Broadcast notification
      broadcastNotification(notification);
    }

    res.json({
      success: true,
      batchId,
      fileCount,
      files: documents,
      isBulk: fileCount > 3,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const document = await Document.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      path: req.file.path,
      status: 'complete',
      downloadUrl: `/api/upload/download/${req.file.filename}`,
    });

    res.json({
      success: true,
      file: document,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

// Get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Download file
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filepath);
  } catch (err) {
    res.status(500).json({ error: 'Download failed' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from disk
    const filepath = path.join(__dirname, '../uploads', document.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    res.json({ success: true, message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
