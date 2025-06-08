import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./components/context/AuthContext";
import Home from "./components/pages/Home";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import SearchPage from "./components/pages/SearchPage";
import AdminPage from "./components/pages/AdminPage";
import Header from "./components/Shared/Header";
import Footer from "./components/Shared/Footer";
import Notification from "./components/Shared/Notification";
import BookingConfirmation from "./components/Booking/BookingConfirmation";
import BookingDetails from "./components/Booking/BookingDetails";
import "./styles/App.scss";

function PrivateRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  const { notification } = useContext(AuthContext);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />

        <Route path="/booking/:flightId" element={<BookingDetails />} />
        <Route
          path="/confirmation/:bookingId"
          element={<BookingConfirmation />}
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {notification.show && <Notification message={notification.message} />}
      <Footer />
    </div>
  );
}

export default App;
