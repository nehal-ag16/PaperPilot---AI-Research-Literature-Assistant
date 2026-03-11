const express = require('express');
const multer = require('multer');
const router = express.Router();
// Bypass auth for testing without DB
const protect = (req, res, next) => { req.user = { _id: 'local-test-user' }; next(); };

// In-memory document storage since MongoDB is disabled
const mockDocs = new Map();
mockDocs.set("1", { _id: "1", title: "Attention Is All You Need.pdf", s3Url: "/uploads/mock.pdf" });
mockDocs.set("2", { _id: "2", title: "GPT-4 Technical Report.pdf", s3Url: "/uploads/mock.pdf" });
mockDocs.set("3", { _id: "3", title: "React Context API Optimization.pdf", s3Url: "/uploads/mock.pdf" });

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fs = require('fs');
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed!'), false);
  }
});

router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

    const docId = Date.now().toString();
    const newDoc = {
      _id: docId,
      user: req.user._id,
      title: req.file.originalname,
      fileName: req.file.filename,
      fileSize: req.file.size,
      s3Url: `http://localhost:5000/uploads/${req.file.filename}`
    };
    
    // Save to our memory map
    mockDocs.set(docId, newDoc);

    const { extractTextFromPDF } = require('../../../ai_pipeline/src/pdfExtractor');
    const { processAndStoreDocument } = require('../../../ai_pipeline/src/vectorStore');
    
    extractTextFromPDF(req.file.path).then(text => {
      console.log(`Extracted text for ${docId}, storing in vector store...`);
      return processAndStoreDocument(text, docId);
    }).catch(err => console.error('Background processing failed:', err));
    
    res.status(201).json(newDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  res.json(Array.from(mockDocs.values()));
});

router.get('/:id', protect, async (req, res) => {
  const doc = mockDocs.get(req.params.id);
  if (doc) res.json(doc);
  else res.status(404).json({ message: 'Document not found' });
});

module.exports = router;
