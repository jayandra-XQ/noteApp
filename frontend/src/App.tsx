
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import styles from './styles/NotePage.module.css'
import { User } from "./models/user";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView";
import NotePageLoggedOutView from "./components/NotePageLoggedOutView";


function App() {

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse the response as JSON
        setLoggedInUser(data.user); // Assuming the response contains a 'user' field
  
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
  
    fetchLoggedInUser();
  }, []);
  

  return (
    <>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => setLoggedInUser(null)}
        />

        <Container className={styles.notePage}>

          <>
            {
              loggedInUser
                ? <NotesPageLoggedInView />
                : <NotePageLoggedOutView />
            }
          </>
        </Container>

        {showSignUpModal &&
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onsignUpSuccessful={(user) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }}
          />
        }

        {showLoginModal &&
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccessful={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
            }}
          />
        }
      </div>
    </>
  )
}

export default App
