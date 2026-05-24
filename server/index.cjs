const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

function cleanJSON(text) {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

app.post('/api/event', async (req, res) => {
  if (!API_KEY) return res.status(500).json({ error: "No API Key" });
  try {
    const { gameState } = req.body;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a game engine for "Pax Historia", a grand strategy game.
      Current State: ${JSON.stringify(gameState)}

      Generate a historical event with 3 choices.
      Return valid JSON only:
      {
        "title": "Title",
        "description": "Text",
        "choices": [
          { "text": "Choice 1", "consequence": { "gold": -50, "troops": 5, "message": "Result" } },
          { "text": "Choice 2", "consequence": { "gold": 100, "troops": -5, "message": "Result" } },
          { "text": "Choice 3", "consequence": { "gold": 0, "troops": 0, "message": "Result" } }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json(JSON.parse(cleanJSON(response.text())));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate event" });
  }
});

app.post('/api/diplomacy', async (req, res) => {
  if (!API_KEY) return res.status(500).json({ error: "No API Key" });
  try {
    const { message, nation, leaderType, playerStatus } = req.body;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are the leader of ${nation} in "Pax Historia".
      Personality: ${leaderType} (Aggressive, Diplomatic, or Cowardly).
      Player Status: ${playerStatus}

      The player says: "${message}"

      Respond as this leader. Be brief, thematic, and decisive.
      Also, decide on a diplomatic action (Accept, Reject, Counter).

      Return valid JSON:
      {
        "response": "Leader's verbal response...",
        "action": "Accept/Reject/Counter",
        "consequence": { "stabilityChange": 0, "goldChange": 0 }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json(JSON.parse(cleanJSON(response.text())));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process diplomacy" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
