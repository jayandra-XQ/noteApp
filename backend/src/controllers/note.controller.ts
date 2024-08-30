import { RequestHandler } from "express";
import noteModel from "../models/note.model";
import mongoose from "mongoose";


export const getNotes: RequestHandler = async (req,res) => {
  try {
    const notes = await noteModel.find({}).exec();
    res.status(200).json(notes);
    
  } catch (error) {
    const err = error as Error
    console.log("error in get notes controller",err.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
}



export const getNote: RequestHandler = async (req, res) => {
    const noteId = req.params.noteId;

  try {
    const note = await noteModel.findById(noteId).exec();
    res.status(200).json({note, success:true})

  } catch (error) {
    const err = error as Error
    console.log("error in get note controller",err.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
}


export const createNotes: RequestHandler = async (req,res) => {
  try {
    const {title, text} : {title:string; text:string} = req.body;
    const newNote = await  noteModel.create({title,text});
    

    res.status(200).json({success:true , newNote})

  } catch (error) {
    const err = error as Error
    console.log("error in create notes controller",err.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

interface updateNoteParams {
  noteId: string,
}

interface updateNoteBody{
  title?: string,
  text?: string,

}


export const updateNotes: RequestHandler<updateNoteParams, unknown, updateNoteBody, unknown> = async (req,res) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  try {

    if (!mongoose.isValidObjectId(noteId)) {
      return res.status(500).json({success: false, message:"Invalid credientials"})
    }

    if(!newTitle) {
      return res.status(400).json({success: false, message:"Title is required"})
    }

    if(!newText){
      return res.status(400).json({success: false, message:"Text is required"})
    }

    const note = await noteModel.findById(noteId).exec();
    if(!note){
      return res.status(404).json({success: false, message:"Note not found"})
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();
    res.status(200).json({success:true, updatedNote})

  } catch (error) {
    const err = error as Error
    console.log("error in update notes controller",err.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
}


export const deleteNotes : RequestHandler = async(req,res) => {
  const noteId = req.params.noteId;
  try {
     // Validate ObjectId
     if (!mongoose.isValidObjectId(noteId)) {
      return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    const deleteNote = await noteModel.findByIdAndDelete(noteId).exec();

     // Check if the note was found and deleted
     if (!deleteNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // Return success response
    return res.status(200).json({ success: true, message: "Note deleted successfully" });

    
  } catch (error) {
    const err = error as Error;
    console.log("error in delete notes controller",err.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
}