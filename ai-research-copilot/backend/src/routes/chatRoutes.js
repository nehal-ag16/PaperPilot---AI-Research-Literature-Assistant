const express = require('express');
const router = express.Router();
const path = require('path');
const { protect } = require('../middlewares/authMiddleware');
const { queryRag } = require('../../../ai_pipeline/src/ragService');

// @desc    Query the AI about a specific document
// @route   POST /api/chat/:documentId
// @access  Public (for testing)
router.post('/:documentId', async (req, res) => {
  try {
    const { message } = req.body;
    const { documentId } = req.params;
    
    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Call the actual AI Pipeline
    console.log(`Querying RAG for document ${documentId}...`);
    const aiResponse = await queryRag(message, documentId);

    res.json({
      role: 'assistant',
      content: aiResponse.answer,
      citations: aiResponse.citations
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

module.exports = router;
