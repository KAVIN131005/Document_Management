const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'uploading', 'complete', 'failed'],
    default: 'pending',
  },
  batchId: {
    type: String,
  },
  downloadUrl: {
    type: String,
  },
});

module.exports = mongoose.model('Document', documentSchema);
