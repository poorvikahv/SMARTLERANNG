import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  passwordHash: { type: String },
  role: { type: String, default: 'student' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
