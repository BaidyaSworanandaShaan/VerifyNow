const express = require("express");
const cors = require("cors");
const translate = require("google-translate-api-x");

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing

// Translation API Route
app.post("/translate", async (req, res) => {
  const { text } = req.body;

  try {
    const { text: translatedText } = await translate(text, {
      from: "ne", // Nepali
      to: "en", // English
    });

    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: "Translation failed", details: error });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
