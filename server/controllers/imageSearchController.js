const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Configure multer to handle image uploads
const upload = multer({ storage: multer.memoryStorage() });

const detectCuisine = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const imagePart = {
      inlineData: { data: base64Image, mimeType },
    };

    const prompt = "Identify the cuisine type of the dish in the image. Just type the cuisine type (e.g., Italian, Chinese, etc.).";

    // Ensure model request is handled correctly
    const result = await model.generateContent([prompt, imagePart]);

    if (!result || !result.response) {
      throw new Error("Invalid API response from Gemini AI");
    }

    const cuisineType = result.response.text()?.trim();

    if (!cuisineType) {
      return res.status(500).json({ error: "Failed to determine cuisine type" });
    }

    res.json({ cuisine: cuisineType });
  } catch (error) {
    console.error("❌ Error processing image:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Export the function and multer middleware
module.exports = { detectCuisine, upload };