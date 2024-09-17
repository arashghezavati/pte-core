import mongoose from 'mongoose';

// Schema for the multiple-choice question
const mcmaSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The text to read
  question: { type: String, required: true }, // The question
  options: [{ type: String, required: true }], // Array of options
  correctAnswers: [{ type: Number, required: true }] // Array of indices of correct answers
});

export default mongoose.model('Mcma', mcmaSchema);
