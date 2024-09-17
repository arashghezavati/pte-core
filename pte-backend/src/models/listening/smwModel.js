import mongoose from 'mongoose';

const smwSchema = mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    audioUrl:{
        type: String,
        required:true
    },
    options:[{
        text:String,
        _id:Number
    }],
    correctAnswer:Number
});


export default mongoose.model("Smw", smwSchema);