import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user"

interface NavBarLoggedInViewProps {
  user: User,
  onLogoutSuccessful: () => void,
}


const NavBarLoggedInView = ({user, onLogoutSuccessful}: NavBarLoggedInViewProps) => {

  const logout = async () => {
    try {
      const res = await fetch ('/api/users/logout' , {
        method: "POST",
      })
      if (res.ok) {
        onLogoutSuccessful();
      } else {
        console.error("Failed to log out");
      }
      
    } catch (error) {
      const err = error as Error;
      console.error(err.message); 
    }
  }
  return (
    <>
      <Navbar.Text className="me-2">
        Signed in as: {user.username}
      </Navbar.Text>

      <Button onClick={logout}>Logout</Button>
    </>
  )
}

export default NavBarLoggedInView