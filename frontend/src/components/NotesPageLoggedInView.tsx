import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import styleUtils from '../styles/utils.module.css'
import AddNoteDialog from "./AddNoteEditDialog";
import AddNoteEditDialog from "../components/AddNoteEditDialog"
import { Note as NoteModel } from "../models/note";
import Note from "./Note";
import styles from '../styles/NotePage.module.css'

const NotesPageLoggedInView = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false)

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true)
        const res = await fetch("/api/notes/get-notes", {
          method: "GET",
        })
        const data = await res.json();
        setNotes(data);

      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  const deleteNote = async (note: NoteModel) => {
    try {
      const res = await fetch(`/api/notes/delete-note/${note._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes(notes.filter(existingNote => existingNote._id !== note._id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const notesGrid =
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {notes.length > 0 ? (
        notes.map((note) => (
          <Col key={note._id}>
            <Note
              note={note}
              className={styles.note}
              onNoteClicked={setNoteToEdit}
              onDeleteNoteClicked={deleteNote}
            />
          </Col>
        ))
      ) : (
        <p>No notes available</p>
      )}
    </Row>


  return (
    <>
      <Button
        className={`mb-4 mt-2 ${styleUtils.blockCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        <FaPlus />  &nbsp;
        Add new note
      </Button>

      {
        notesLoading && <Spinner animation="border" variant="primary" />
      }

      {
        showNotesLoadingError && <p>Something went wrong. Please refresh the page.</p>
      }

      {!notesLoading && !showNotesLoadingError &&
        <>
          {
            notes.length > 0 ? notesGrid : <p>You don't have any notes yet</p>
          }
        </>
      }

      {
        showAddNoteDialog &&
        <AddNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />

      }
      {noteToEdit &&
        <AddNoteEditDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updatedNote) => {
            setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
            setNoteToEdit(null);
          }}
        />
      }

    </>
  )
}

export default NotesPageLoggedInView