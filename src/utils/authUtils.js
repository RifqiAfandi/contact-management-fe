export const logout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      const BACKEND_URL = import.meta.env.VITE_URL_BACKEND;

      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return !!(token && user);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};
