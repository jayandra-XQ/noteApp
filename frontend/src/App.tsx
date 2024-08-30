import { useEffect, useState } from "react"
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";


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
    <div>
      {notes.length > 0 ? (
        notes.map((note) => (
          <Note note={note} key={note._id} />
        ))
      ) : (
        <p>No notes available</p>
      )}
    </div>
  </>
  )
}

export default App
