import { Link } from "react-router-dom";
import Signup from "../Auth/Signup";
import "../../styles/SignupPage.scss";

const SignupPage = () => {
  return (
    <div className="signup-page">
      <h2>Create Your Account</h2>
      <Signup />
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default SignupPage;
