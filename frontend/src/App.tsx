import { useEffect, useState } from "react"
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Col, Container, Row } from "react-bootstrap";

import styles from './styles/NotePage.module.css'


function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

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
    </Container>
  </>
  )
}

export default App
