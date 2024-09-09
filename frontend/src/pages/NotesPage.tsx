import { Container } from "react-bootstrap"
import styles from '../styles/NotePage.module.css'
import NotesPageLoggedInView from "../components/NotesPageLoggedInView"
import { User } from "../models/user";
import NotePageLoggedOutView from "../components/NotePageLoggedOutView";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({loggedInUser}: NotesPageProps) => {
  return (
    <Container className={styles.notePage}>

    <>
      {
        loggedInUser
          ? <NotesPageLoggedInView />
          : <NotePageLoggedOutView />
      }
    </>
  </Container>
  )
}

export default NotesPage