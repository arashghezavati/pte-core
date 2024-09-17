import mongoose from 'mongoose';

// Schema for incorrect words
const incorrectWordSchema = new mongoose.Schema({
    position: { type: Number, required: true }, // Position of the incorrect word in the transcript
    incorrectWord: { type: String, required: true }, // The incorrect word as it appears in the transcript
    correctWord: { type: String, required: true } // The correct word
});

// Main schema
const hiwSchema = new mongoose.Schema({
    audioUrl: { type: String, required: true }, // URL to the audio file
    transcript: { type: String, required: true }, // Full transcript
    incorrectWords: { type: [incorrectWordSchema], required: true } // Array of incorrect words with their positions and corrections
});

export default mongoose.model("Hiw", hiwSchema);
