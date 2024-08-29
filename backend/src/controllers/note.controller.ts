import { RequestHandler } from "express";
import noteModel from "../models/note.model";


export const getNotes: RequestHandler = async (req,res) => {
  try {
    const notes = await noteModel.find({}).exec();
    res.status(200).json({success:true , notes});
    
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
}