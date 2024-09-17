import mongoose from 'mongoose';


const answerShortQuestionSchema = new mongoose.Schema({
    url:String,
    answer:String,
    audioScript:String
})

export default mongoose.model("AnswerShortQuestion", answerShortQuestionSchema)