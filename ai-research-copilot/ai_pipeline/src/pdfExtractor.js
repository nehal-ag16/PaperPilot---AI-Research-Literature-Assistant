const fs = require('fs');
const pdf = require('pdf-parse');

/**
 * Extracts raw text from a PDF file.
 * @param {string} filePath - Path to the uploaded PDF document
 * @returns {Promise<string>} - The extracted text
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // data.text contains the raw text content of the PDF
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

module.exports = {
  extractTextFromPDF
};
