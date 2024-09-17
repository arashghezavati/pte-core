import mongoose from 'mongoose';

const { Schema } = mongoose;

const sstSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

export default mongoose.model('Sst', sstSchema);
