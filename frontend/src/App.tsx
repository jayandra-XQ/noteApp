import { useEffect, useState } from "react"
import { Note } from "./models/note";


function App() {
  const [notes, setNotes] = useState<Note[]>([]);

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
        {JSON.stringify(notes)}
      </div>
    </>
  )
}

export default App
