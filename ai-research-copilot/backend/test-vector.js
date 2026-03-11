require('dotenv').config({ path: '../.env' });
const { similaritySearch, processAndStoreDocument, getStoreSize } = require('../ai_pipeline/src/vectorStore');

async function test() {
  console.log("Initial store size:", getStoreSize());
  
  await processAndStoreDocument("Artificial Intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence of humans and other animals.", "doc1");
  await processAndStoreDocument("Machine learning is a subfield of AI.", "doc1");
  await processAndStoreDocument("The sky is blue.", "doc2");

  console.log("Store size after insert:", getStoreSize());

  const results = await similaritySearch("What is AI?", 4, d => d.metadata.documentId === "doc1");
  console.log("Search matches:");
  results.forEach(r => console.log(`- Score: ${r.similarity.toFixed(4)} Text: ${r.text}`));
}

test();
