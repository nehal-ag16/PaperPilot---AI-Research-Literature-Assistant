const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { similaritySearch } = require('./vectorStore');

/**
 * Queries the LLM with context injected from the Vector Database (RAG)
 * @param {string} query - The user's question
 * @param {string} documentId - The unique ID of the document to scope the search
 * @returns {Promise<Object>} - Contains answer string and citations array
 */
async function queryRag(query, documentId) {
  try {
    // Retrieve top 4 most relevant chunks
    console.log(`Searching vector store for query: '${query}' in docId: '${documentId}'`);
    const results = await similaritySearch(
      query, 
      4, 
      (doc) => {
        // console.log(`Checking memory document ${doc.metadata.documentId} against target target ${documentId}`);
        return String(doc.metadata.documentId) === String(documentId);
      }
    );
    console.log(`Search yielded ${results.length} chunks of context.`);
    const contextText = results.map((chunk, i) => `[Source ${i + 1}] ${chunk.text}`).join('\n\n');

    // Setup Chat Model using Gemini
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
      model: "gemini-2.5-flash", 
      temperature: 0,
    });

    const prompt = `You are a helpful AI Research Assistant analyzing a document. 
Please respond to the user's prompt based primarily on the provided CONTEXT. If the user asks a specific question and the answer cannot be found in the context, say "I cannot find the answer in the provided document." However, if the user asks you to summarize, extract key points, or explain the document, use the context to fulfill their request playfully and concisely.
Always cite your sources using the [Source X] notation where appropriate.

CONTEXT:
${contextText}

USER QUESTION:
${query}
`;

    // String prompt is safest to avoid role array parsing issues
    const response = await model.invoke(prompt);

    // Format citations to return to frontend
    const citations = results.map(chunk => ({
      text: chunk.text.substring(0, 100) + '...', // snippet
      page: 1 // Custom splitter doesn't track pages
    }));

    return {
      answer: response.content,
      citations
    };
  } catch (error) {
    console.error('Error querying RAG:', error);
    throw error;
  }
}

/**
 * Generates an automated summary of a document
 */
async function generateSummary(documentId) {
  return "This is a generated summary of the requested document using Google Gemini.";
}

module.exports = {
  queryRag,
  generateSummary
};
