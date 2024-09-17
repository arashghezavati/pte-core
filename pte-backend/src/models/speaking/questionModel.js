


import mongoose from 'mongoose';


const questionSchema = new mongoose.Schema({
    text: String
});

export default mongoose.model('Question', questionSchema);
