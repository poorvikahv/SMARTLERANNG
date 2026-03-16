import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import chatbotRoutes from './routes/chatbot.js';
import emotionRoutes from './routes/emotion.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_learning';
mongoose.connect(MONGO_URI, { })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connect error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/emotion', emotionRoutes);

app.get('/', (req, res) => res.send('AI Smart Learning Backend'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
