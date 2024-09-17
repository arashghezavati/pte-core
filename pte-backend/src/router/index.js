import express from 'express';
import Question from '../models/speaking/questionModel.js';
import Audio from '../models/speaking/audioModel.js';
import Image from '../models/speaking/imageModel.js';
import Retell from '../models/speaking/retellModel.js';
import AnswerShortQuestion from '../models/speaking/answerShortQuestionModel.js'
import Swt from "../models/writing/swtModel.js";
import We from '../models/writing/we.js';
import Sst from '../models/listening/sstModel.js'
import Mc from '../models/listening/mcModel.js'
import Lfib from '../models/listening/lfibModel.js'
import Hcs from '../models/listening/hcsModel.js'
import Csa from '../models/listening/csaModel.js'
import Smw from '../models/listening/smwModel.js';
import Wfd from '../models/listening/wfdModel.js';
import Hiw from "../models/listening/hiwModel.js";
import Rwfib from "../models/reading/rwfibModel.js";
import Mcma from '../models/reading/mcmaModel.js';
import Mcaa from '../models/reading/mcaaModel.js';
import Rfib from '../models/reading/rfibModel.js';
import Rop from "../models/reading/ropModel.js";
import RepeatSentence from '../models/speaking/repeatSentenceModel.js';
import userRoutes from './userRoutes.js';
import { protect } from '../middleware/auth.js';



const router = express.Router();

router.get('/', (req, res) => {
    res.send('API is running');
});
// In your userRoutes.js or wherever you handle routes
router.get('/validate-token', protect, (req, res) => {
    res.json({ success: true, data: req.user });
});


// Apply protect middleware to each route
router.get('/questions', protect, async (req, res) => {
    const questions = await Question.find();
    res.json(questions);
});

router.get('/audio', protect, async (req, res) => {
    const audio = await Audio.find();
    if (!audio.length) return res.status(404).json({ message: 'Audio not found' });
    res.json(audio.map(a => a.url));
});


router.get('/image', protect, async (req, res) => {
    const image = await Image.find();
    if (!image.length) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
});

router.get('/retell', protect, async (req, res) => {
    const retell = await Retell.find();
    if (!retell.length) return res.status(404).json({ message: "Retell audios not found" });
    res.json(retell);
});
router.get('/repeatSentence', protect, async (req, res) => {
    const repeatSentence = await RepeatSentence.find();
    if (!repeatSentence.length) return res.status(404).json({ message: "Repeat Sentence not found" });
    res.json(repeatSentence);
});

router.get('/short', protect, async (req, res) => {
    const shortAnswer = await AnswerShortQuestion.find();
    if (!shortAnswer.length) return res.status(404).json({ message: "Short answer not found" });
    res.json(shortAnswer); });

router.get('/swt', protect, async (req, res) => {
    const swt = await Swt.find();
    res.json(swt);
});

// router.get('/we', protect, async (req, res) => {
//     const we = await We.find();
//     res.json(we);
// });
router.get('/we', protect, async (req, res) => {
    try {
        const we = await We.find();
        res.json(we);
    } catch (error) {
        console.error("Error fetching data from we collection", error);
        res.status(500).json({message: "Internal server error"});
    }
});


router.get("/sst", protect, async (req, res) => {
    const sst = await Sst.find();
    res.json(sst);
});

router.get("/mc", protect, async (req, res) => {
    const mc = await Mc.find();
    res.json(mc);
});

router.get('/lfib', protect, async (req, res) => {
    const lfib = await Lfib.find();
    res.json(lfib);
});

router.get('/hcs', protect, async (req, res) => {
    const hcs = await Hcs.find();
    res.json(hcs);
});

router.get('/csa', protect, async (req, res) => {
    const csa = await Csa.find();
    res.json(csa);
});

router.get("/smw", protect, async (req, res) => {
    const smw = await Smw.find();
    res.json(smw);
});

router.get("/wfd", protect, async (req, res) => {
    const wfd = await Wfd.find();
    res.json(wfd);
});

router.get("/hiw", protect, async (req, res) => {
    const hiw = await Hiw.find();
    res.json(hiw);
});

router.get("/rwfib", protect, async (req, res) => {
    const rwfib = await Rwfib.find();
    res.json(rwfib);
});

router.get("/mcma", protect, async (req, res) => {
    const mcma = await Mcma.find();
    res.json(mcma);
});

router.get("/mcaa", protect, async (req, res) => {
    const mcaa = await Mcaa.find();
    res.json(mcaa);
});

router.get("/rfib", protect, async (req, res) => {
    const rfib = await Rfib.find();
    res.json(rfib);
});

router.get("/rop", protect, async (req, res) => {
    const rop = await Rop.find();
    res.json(rop);
});

// Mount user authentication routes
router.use('/users', userRoutes);





export default router;


