const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // Load .env from root

// Global custom in-memory store
const memoryStore = [];

/**
 * Custom text splitter based on character length
 */
function splitText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    
    // Attempt to break at a space if possible
    if (endIndex < text.length) {
      const spaceIndex = text.lastIndexOf(' ', endIndex);
      if (spaceIndex > startIndex) {
        endIndex = spaceIndex;
      }
    }
    
    chunks.push(text.slice(startIndex, endIndex));
    startIndex = endIndex - overlap;
    
    if (startIndex < 0) break; // Safeguard
    // Also safeguard against no progression:
    if (endIndex <= startIndex) break;
  }
  
  return chunks;
}

/**
 * Calculates cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Similar chunks search
 */
async function similaritySearch(query, topK, filterFn) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001", 
  });
  
  const [queryEmbedding] = await embeddings.embedDocuments([query]);
  
  const results = [];
  for (const item of memoryStore) {
    if (filterFn && !filterFn(item)) continue;
    
    const similarity = cosineSimilarity(queryEmbedding, item.embedding);
    results.push({ ...item, similarity });
  }
  
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topK);
}

/**
 * Splits text into chunks and generates embeddings, storing them in memory
 */
async function processAndStoreDocument(text, documentId) {
  try {
    const chunks = splitText(text, 1000, 200);
    
    const embeddingsModel = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001", 
    });
    
    // Gemini has an API rate limit, batching chunk embeddings is safer
    // But embedDocuments already accepts an array
    console.log(`Embedding ${chunks.length} chunks for document ${documentId}...`);
    const chunkEmbeddings = await embeddingsModel.embedDocuments(chunks);
    
    for (let i = 0; i < chunks.length; i++) {
      memoryStore.push({
        text: chunks[i],
        metadata: { documentId, index: i },
        embedding: chunkEmbeddings[i]
      });
    }
    
    console.log(`Successfully stored ${chunks.length} chunks for document ${documentId} in memory`);
    return true;
  } catch (error) {
    console.error('Error processing and storing document:', error);
    throw error;
  }
}

module.exports = {
  processAndStoreDocument,
  similaritySearch,
  getStoreSize: () => memoryStore.length
};
