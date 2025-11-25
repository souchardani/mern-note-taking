import Note from "../models/Note.js";
import logger from "../config/logger.js";
import xss from "xss";

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); //newest first
    res.status(200).json(notes);
    logger.info("getAllNotes executed successfully");
  } catch (error) {
    logger.error("Error in getAllNotes controller:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json("note not found");
    res.status(200).json(note);
  } catch (error) {
    logger.error("Error in getNoteById controller:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const sanitizedTitle = xss(title);
    const sanitizedContent = xss(content);
    const newNote = new Note({
      title: sanitizedTitle,
      content: sanitizedContent,
    });
    const savedNote = await newNote.save();
    res
      .status(201)
      .json({ message: "Note created succesfully", note: savedNote });
  } catch (error) {
    logger.error("Error in createNote controller:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const sanitizedTitle = xss(title);
    const sanitizedContent = xss(content);
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: sanitizedTitle,
        content: sanitizedContent,
      },
      { new: true }
    );
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
    res
      .status(200)
      .json({ message: "Note updated succesfully", note: updatedNote });
  } catch (error) {
    logger.error("Error in updateNote controller:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res
      .status(200)
      .json({ message: "Note deleted succesfully", note: deletedNote });
  } catch (error) {
    logger.error("Error in deleteNote controller:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "internal server error",
    });
  }
}
