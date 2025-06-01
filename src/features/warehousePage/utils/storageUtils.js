export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const clearAuthData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};