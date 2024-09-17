import mongoose from "mongoose";

const repeatSentenceSchema = new mongoose.Schema({
    url:String,
    script:String
})

export default mongoose.model("RepeatSentence",repeatSentenceSchema)