const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  s3Url: {
    type: String, // Mock property for where the file is stored (e.g. S3, local, etc)
    required: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'embedded', 'failed'],
    default: 'uploaded'
  },
  summary: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
