import { createContext, useState, useEffect, useCallback, useRef } from "react";
import bcrypt from "bcryptjs";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const timeoutIdRef = useRef(null);
  const warningTimeoutIdRef = useRef(null);

  const INACTIVITY_LIMIT = 5 * 60 * 1000;
  const WARNING_TIME = 30 * 1000;

  const showNotification = (message) => {
    setNotification({ show: true, message });
    if (message !== "You will be logged out in 30 seconds due to inactivity.") {
      setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 5000);
    }
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "" });
  };

  const resetInactivityTimer = useCallback(() => {
    if (!user) return;

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);

    warningTimeoutIdRef.current = setTimeout(() => {
      showNotification(
        "You will be logged out in 30 seconds due to inactivity."
      );
    }, INACTIVITY_LIMIT - WARNING_TIME);

    timeoutIdRef.current = setTimeout(() => {
      logout();
      setNotification({ show: false, message: "" });
      showNotification("You have been logged out due to inactivity.");
    }, INACTIVITY_LIMIT);
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      resetInactivityTimer();
    }

    const events = ["mousemove", "click", "keypress"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (warningTimeoutIdRef.current)
        clearTimeout(warningTimeoutIdRef.current);
    };
  }, [user, resetInactivityTimer]);

  const login = (email, password) => {
    const usersData = localStorage.getItem("users");
    let users = [];
    if (usersData) {
      try {
        users = JSON.parse(usersData);
        if (!Array.isArray(users)) {
          console.warn(
            "Users data is not an array, converting to array:",
            users
          );
          users = [users];
          localStorage.setItem("users", JSON.stringify(users));
        }
      } catch (error) {
        console.error("Error parsing users data:", error);
        users = [];
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
    const foundUser = users.find((u) => u.email === email);
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = (email, password, role) => {
    const usersData = localStorage.getItem("users");
    let users = [];
    if (usersData) {
      try {
        users = JSON.parse(usersData);
        if (!Array.isArray(users)) {
          console.warn(
            "Users data is not an array, converting to array:",
            users
          );
          users = [users];
          localStorage.setItem("users", JSON.stringify(users));
        }
      } catch (error) {
        console.error("Error parsing users data:", error);
        users = [];
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
    if (users.find((u) => u.email === email)) {
      return false;
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { email, password: hashedPassword, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);
    timeoutIdRef.current = null;
    warningTimeoutIdRef.current = null;
    setNotification({ show: false, message: "" });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, notification, closeNotification }}
    >
      {children}
    </AuthContext.Provider>
  );
};
