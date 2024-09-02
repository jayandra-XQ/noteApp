import { useEffect, useState } from "react"
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import styles from './styles/NotePage.module.css'
import styleUtils from './styles/utils.module.css'

import AddNoteDialog from "./components/AddNoteEditDialog";
import AddNoteEditDialog from "./components/AddNoteEditDialog"


function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [showAddNoteDialog , setShowAddNoteDialog] = useState(false);

  const [noteToEdit, setNoteToEdit] = useState<NoteModel| null> (null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await fetch("/api/notes/get-notes",{
          method: "GET",
      })
      const data = await res.json();
      setNotes(data);
        
      } catch (error) {
        console.error(error);
        alert(error)
      }
    }
    loadNotes();
  },[]);

  const deleteNote = async (note: NoteModel) => {
    try {
      const res = await fetch(`/api/notes/delete-note/${note._id}`, {
        method: "DELETE",
      });
      if (res.ok){
        setNotes(notes.filter(existingNote => existingNote._id !== note._id))
      }
    } catch (error) {
      console.error(error)
    }
  }
  

  return (
    <>
    <Container>
      <Button 
      className={`mb-4 mt-2 ${styleUtils.blockCenter}`}
      onClick={() => setShowAddNoteDialog(true)}>
        <FaPlus />  &nbsp;
        Add new note
      </Button>

      <Row xs={1} md={2} xl={3} className="g-4">
      {notes.length > 0 ? (
        notes.map((note) => (
          <Col key={note._id}>
            <Note 
            note={note}  
            className={styles.note}
            onNoteClicked={ setNoteToEdit}
            onDeleteNoteClicked={deleteNote}
            />
          </Col>
        ))
      ) : (
        <p>No notes available</p>
      )}
      </Row>

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
    </Container>
  </>
  )
}

export default App
