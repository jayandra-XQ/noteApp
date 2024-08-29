import express from 'express';
import { createNotes, getNotes, getNote, updateNotes, deleteNotes } from '../controllers/note.controller';

const router = express.Router();

router.get('/get-notes', getNotes);
router.get('/get-note/:noteId', getNote)

router.post('/create-note', createNotes)

router.patch('/update-note/:noteId', updateNotes)


router.delete('/delete-note/:noteId', deleteNotes)


export default router