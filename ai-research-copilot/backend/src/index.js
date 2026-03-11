const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: '../.env' }); // Adjust path to reach root .env

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
  res.send('AI Research Copilot API is running...');
});

// Seed mock data into the in-memory vector store so frontend tests work immediately
const { processAndStoreDocument } = require('../../ai_pipeline/src/vectorStore');
setTimeout(async () => {
  try {
    console.log("Seeding mock documents into memory vector store...");
    await processAndStoreDocument("Attention Is All You Need. The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.", "1");
    await processAndStoreDocument("GPT-4 is a large multimodal model. It exhibits human-level performance on various professional and academic benchmarks.", "2");
    await processAndStoreDocument("React context API serves to broadcast state changes across the component tree without prop drilling. Memoization helps optimize rerenders.", "3");
    console.log("Mock data seeded successfully.");
  } catch(e) { console.error("Error seeding:", e.message); }
}, 2000);

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
