import { Container } from "react-bootstrap"
import styles from '../styles/NotePage.module.css'
import NotesPageLoggedInView from "../components/NotesPageLoggedInView"
import NotesPageLoggedOutView from "../components/NotePageLoggedOutView"
import { User } from "../models/user";

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
          : <NotesPageLoggedOutView />
      }
    </>
  </Container>
  )
}

export default NotesPage