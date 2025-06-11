import { useState, useEffect } from 'react';
import { getStoredUser } from '../utils/storageUtils.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return { user, setUser };
};
