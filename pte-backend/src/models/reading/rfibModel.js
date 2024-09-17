import mongoose from 'mongoose';

// Schema for the drag-and-drop fill-in-the-blanks question
const rfibSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The text with placeholders
  words: [{ type: String, required: true }], // Array of words to drag
  correctAnswers: [{ type: Number, required: true }] // Indices of the correct answers in the text
});

export default mongoose.model('Rfib', rfibSchema);
