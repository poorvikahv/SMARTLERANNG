import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: Array
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
