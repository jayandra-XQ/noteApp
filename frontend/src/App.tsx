import { useEffect, useState } from "react"
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Button, Col, Container, Row } from "react-bootstrap";

import styles from './styles/NotePage.module.css'
import styleUtils from './styles/utils.module.css'

import AddNoteDialog from "./components/AddNoteDialog";


function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [showAddNoteDialog , setShowAddNoteDialog] = useState(false);

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
  

  return (
    <>
    <Container>
      <Button 
      className={`mb-4 mt-2 ${styleUtils.blockCenter}`}
      onClick={() => setShowAddNoteDialog(true)}>
        Add new note
      </Button>

      <Row xs={1} md={2} xl={3} className="g-4">
      {notes.length > 0 ? (
        notes.map((note) => (
          <Col key={note._id}>
            <Note note={note}  className={styles.note}/>
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
    </Container>
  </>
  )
}

export default App
