require('dotenv').config({ path: '../.env' });
const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');

async function run() {
  try {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash", 
      temperature: 0,
      apiKey: process.env.GOOGLE_API_KEY
    });
    console.log("Model flash instantiated!");
    const r = await model.invoke("Reply with 'Hello 123'");
    console.log("Chat flash response:", r.content);
  } catch(e) { console.error("Model flash error:", e); }

  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", 
      apiKey: process.env.GOOGLE_API_KEY
    });
    console.log("Embeddings 004 instantiated!");
    await embeddings.embedDocuments(["Hello"]);
    console.log("Embedded 004!");
  } catch(e) { console.error("Embeddings error:", e); }
}

run();
