import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, session } = req.body;
    if (!message) return res.status(400).json({ error: 'No message' });

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        max_tokens: 600
      })
    });

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I could not respond.';
    res.json({ reply, raw: data });
  } catch (err) {
    console.error('chatbot error', err);
    res.status(500).json({ error: 'chatbot error' });
  }
});

export default router;
