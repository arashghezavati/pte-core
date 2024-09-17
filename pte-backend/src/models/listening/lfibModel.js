import mongoose from 'mongoose';

const lfibSchema = mongoose.Schema({
    title: { type: String, required: true },
    audioUrl: { type: String, required: true },
    transcriptTemplate: { type: String, required: true },
    blanks: [{
        position: Number,
        correctAnswer: String,
    }]
});

export default mongoose.model("Lfib",lfibSchema)
