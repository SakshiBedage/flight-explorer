import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../../styles/Notification.scss";

function Notification({ message }) {
  const { closeNotification } = useContext(AuthContext);

  useEffect(() => {
    if (message === "You will be logged out in 30 seconds due to inactivity.") {
      const timer = setTimeout(() => {
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="notification">
      <p>{message}</p>
      <button
        className="close-btn"
        onClick={closeNotification}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Notification;
