import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/predict', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'no image' });

    const resp = await fetch(process.env.EMOTION_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 })
    });

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error('emotion forwarder error', err);
    res.status(500).json({ error: 'emotion service error' });
  }
});

export default router;
