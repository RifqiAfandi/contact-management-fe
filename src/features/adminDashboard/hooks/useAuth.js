import { useState, useEffect } from "react";
import { logout } from "../../../utils/authUtils";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return { user, handleLogout };
};
