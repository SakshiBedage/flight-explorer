import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../../styles/Header.scss";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <h1>Flight Explorer</h1>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            {user.role === "user" && (
              <>
                <Link to="/search">Search</Link>
              </>
            )}
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
