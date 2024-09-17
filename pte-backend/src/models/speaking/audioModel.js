import mongoose from "mongoose";
const audioSchema = new mongoose.Schema({
       url: String
});




export default mongoose.model('Audio', audioSchema);
