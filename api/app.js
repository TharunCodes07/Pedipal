const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server'); 
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

app.use(express.json({ limit: '5mb' })); // Adjust this value as needed
app.use(express.urlencoded({ limit: '5mb', extended: true })); // Adjust this value as needed

app.post('/upload-and-generate', async (req, res) => {
  const { image, apiKey } = req.body;
  const mimeType = 'image/jpeg';

  if (!image || !apiKey) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Decode base64 image and save it locally
  const buffer = Buffer.from(image, 'base64');
  fs.mkdirSync('./uploads', { recursive: true });
  const filePath = './uploads/image.jpg';
  fs.writeFileSync(filePath, buffer);

  try {
    const fileManager = new GoogleAIFileManager(apiKey);

    // Upload the file to Google Gemini
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: mimeType ,
      displayName: 'Uploaded Image',
    });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Generate content based on the uploaded image
    const result = await model.generateContent([
      'Tell me about this image.',
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    res.json({ aiResponse: result.response.text() });
  } catch (error) {
    console.error('Error in AI content generation:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});