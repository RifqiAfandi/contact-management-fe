export const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const redirectToLogin = () => {
  window.location.href = "/login";
};
