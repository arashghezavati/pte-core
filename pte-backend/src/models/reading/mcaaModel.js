import mongoose from 'mongoose';

// Schema for the multiple-choice question with a single correct answer
const mcaaSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The text to read
  question: { type: String, required: true }, // The question
  options: [{ type: String, required: true }], // Array of options
  correctAnswer: { type: Number, required: true } // Index of the correct answer
});

export default mongoose.model('Mcaa', mcaaSchema);
