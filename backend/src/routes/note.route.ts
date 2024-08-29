import express from 'express';
import { createNotes, getNotes, getNote } from '../controllers/note.controller';

const router = express.Router();

router.get('/get-notes', getNotes);
router.get('/get-note/:noteId', getNote)
router.post('/create-note', createNotes)

export default router