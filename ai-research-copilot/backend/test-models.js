const fs = require('fs');
require('dotenv').config({ path: '../.env' });
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).map(m => m.name);
      fs.writeFileSync('available-models.json', JSON.stringify(models, null, 2));
      console.log("Wrote models to available-models.json");
    }
  })
  .catch(err => console.error("Fetch error:", err));
