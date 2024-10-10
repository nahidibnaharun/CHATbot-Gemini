require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Google AI setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Chat route to handle chatbot requests
app.post('/chat', async (req, res) => {
  const userInput = req.body.message;

  try {
    // Send user's message to the Gemini model and get the response
    const result = await model.generateContent(userInput);
    const responseText = result.response.text();

    // Send the AI response back to the frontend
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
