import { Link } from "react-router-dom";
import Login from "../Auth/Login";
import "../../styles/LoginPage.scss";

const LoginPage = () => {
  return (
    <div className="login-page">
      <h2>Sign In to Flight Explorer</h2>
      <Login />
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
