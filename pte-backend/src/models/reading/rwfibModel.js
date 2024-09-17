import mongoose from "mongoose";

const optionSchema  =  new mongoose.Schema({
    blankIndex: { type: Number, required: true }, // Index of the blank
    options: [{ type: String, required: true }] // Array of options for the blank
  });

const rwfibModel = new mongoose.Schema({
    text: { type: String, required: true }, // Text with placeholders for blanks
    options: { type: [optionSchema], required: true }, // Options for each blank
    correctAnswers: { type: [String], required: true } // Correct answers for each blank
  });

export default mongoose.model("Rwfib", rwfibModel);
