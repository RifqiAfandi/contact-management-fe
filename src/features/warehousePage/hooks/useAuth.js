import { useState, useEffect } from "react";
import { getStoredUser, clearAuthData } from "../utils/storageUtils";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    clearAuthData();
    window.location.href = "/login";
  };

  return { user, handleLogout };
};