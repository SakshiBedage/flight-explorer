import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Footer.scss";

const Footer = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing! (This is a simulation.)");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate(user ? "/search" : "/login")}>
                Search Flights
              </button>
            </li>
            {user && user.role === "admin" && (
              <li>
                <button onClick={() => navigate("/admin")}>
                  Admin Dashboard
                </button>
              </li>
            )}
            <li>
              <button onClick={() => navigate(user ? "/search" : "/login")}>
                Book a Flight
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-section contact-info">
          <h3>Contact Us</h3>
          <p>Email: support@flightexplorer.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Sky Lane, Aviation City, FL 12345</p>
        </div>

        <div className="footer-section social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">📘</span> Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">🐦</span> Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">📸</span> Instagram
            </a>
          </div>
        </div>

        <div className="footer-section newsletter">
          <h3>Newsletter</h3>
          <p>Stay updated with the latest flight deals!</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button
              className="newsletter-button"
              onClick={handleNewsletterSubmit}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
