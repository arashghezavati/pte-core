import mongoose from 'mongoose';


const wfdSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
    
})

export default mongoose.model("Wfd", wfdSchema);

//"url": "https://pte-core.s3.us-east-2.amazonaws.com/listening/sst/WhatsApp+Audio+2024-05-02+at+15.01.05+(3).mp4",
//   "answer": "The Melk is not typical of all monasteries for many reasons. Firstly, it is very grand which most especially later foundations aren’t. Secondly, it was founded in the countryside, whereas in 17th and 18th centuries, a good proportion of foundations were made in Towns. Thirdly, it still owns substantial amount of land, because fourthly it lies in the Austrian Republic, the only European country where grand old monasteries have been in continuous existence, since they were founded nine hundred a thousand even in one case twelve hundred years ago."