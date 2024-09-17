import mongoose from 'mongoose';

// Schema for the drag-and-drop ordering question
const ropSchema = new mongoose.Schema({
  sourceText: [{ type: String, required: true }], // Array of text boxes in correct order
  scrambledText: [{ type: String, required: true }] // Array of text boxes in scrambled order
});

export default mongoose.model('Rop', ropSchema);
