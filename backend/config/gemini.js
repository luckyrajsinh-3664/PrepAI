const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Primary model string
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

// High-availability lightweight fallback model
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

/**
 * Executes prompt request with automatic fallback if primary model is busy (503/429)
 */
async function generateWithFallback(prompt) {
  try {
    return await model.generateContent(prompt);
  } catch (error) {
    if (error.status === 503 || error.status === 429) {
      console.warn("Primary Gemini model busy (503/429). Switching to fallback model...");
      return await fallbackModel.generateContent(prompt);
    }
    throw error;
  }
}

module.exports = {
  model,
  generateWithFallback
};