import mongoose from 'mongoose'

const hcsSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    options: [{
        text: String,
        _id: Number, 
    }],
    correctAnswer: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Hcs", hcsSchema);
