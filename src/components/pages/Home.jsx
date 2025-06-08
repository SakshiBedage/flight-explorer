import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.scss";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const featuredDestinations = [
    {
      city: "New York",
      image:
        "https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 299,
    },
    {
      city: "Paris",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800",
      price: 399,
    },
    {
      city: "Tokyo",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800",
      price: 499,
    },
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Explore the World with Flight Explorer</h1>
          <p className="hero-subtitle">
            Find the best flights for your next adventure
          </p>
          <button
            className="hero-cta-button"
            onClick={() => navigate(user ? "/search" : "/login")}
          >
            {user ? "Start Searching" : "Log In to Search"}
          </button>
        </div>
      </section>

      <section className="welcome-section">
        <div className="welcome-card">
          <h2 className="welcome-title">
            {user ? `Hello, ${user.email}!` : "Welcome to Flight Explorer"}
          </h2>
          <p className="welcome-message">
            {user
              ? user.role === "admin"
                ? "Manage flights and bookings from the Admin page."
                : "Search and book flights with ease!"
              : "Please log in or sign up to search and book flights."}
          </p>
          {user && user.role === "admin" && (
            <button className="admin-button" onClick={() => navigate("/admin")}>
              Go to Admin Dashboard
            </button>
          )}
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Destinations</h2>
        <div className="destinations-grid">
          {featuredDestinations.map((destination, index) => (
            <div
              key={index}
              className="destination-card"
              style={{ backgroundImage: `url(${destination.image})` }}
            >
              <div className="destination-overlay">
                <h3 className="destination-city">{destination.city}</h3>
                <p className="destination-price">
                  Flights from ${destination.price}
                </p>
                <button
                  className="destination-button"
                  onClick={() => navigate(user ? "/search" : "/login")}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
