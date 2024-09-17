import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_URL;
async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

export default connectDB;
