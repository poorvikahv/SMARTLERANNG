import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  percent: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
