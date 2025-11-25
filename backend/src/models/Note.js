import mongoose from "mongoose";

//1. create a schema
//2. create a model based on the schema

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
  },
  { timestamps: true } //createdAt, //updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
