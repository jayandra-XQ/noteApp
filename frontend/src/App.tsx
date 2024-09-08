
import { useEffect, useState } from "react";

import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";

import { User } from "./models/user";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css";



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
      <BrowserRouter>
        <div>
          <NavBar
            loggedInUser={loggedInUser}
            onLoginClicked={() => setShowLoginModal(true)}
            onSignUpClicked={() => setShowSignUpModal(true)}
            onLogoutSuccessful={() => setLoggedInUser(null)}
          />

          <Container className={styles.pageContainer}>
            <Routes>
              <Route path="/" element={<NotesPage loggedInUser={loggedInUser}/>}/>

              <Route path="/privacy" element={<PrivacyPage />} />

              <Route path="/*" element={<NotFoundPage />}/>
            </Routes>
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
      </BrowserRouter>
    </>
  )
}

export default App
