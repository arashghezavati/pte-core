
import express from 'express';
import connectDB from './src/config/db.js';
import router from './src/router/index.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  // Adjust if necessary
    optionsSuccessStatus: 200
}));

app.use('/api', router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
