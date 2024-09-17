import mongoose from 'mongoose'


const swtSchema = new mongoose.Schema({
    question:String,
    answer:String
})

export default mongoose.model("Swt", swtSchema);