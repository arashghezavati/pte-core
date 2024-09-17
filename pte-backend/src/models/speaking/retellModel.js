import mongoose from 'mongoose'

const retellSchema = new mongoose.Schema({
   url : String,
   script:String
})



export default mongoose.model("Retell",retellSchema)