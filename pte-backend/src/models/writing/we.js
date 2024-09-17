import mongoose from 'mongoose'

const { Schema } = mongoose


const we = new Schema({
    question:{
        type:String,
        required:true
    },

    answer:{
        type:String,
        required:true
    }
    
    
});

export default mongoose.model("We", we);

