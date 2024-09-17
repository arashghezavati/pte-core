import mongoose from 'mongoose';

const mcSchema = new mongoose.Schema({
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
    correctAnswers: [{
        type: Number,
        required: true
    }]
});

export default mongoose.model("Mc", mcSchema);
