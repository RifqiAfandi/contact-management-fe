import { BACKEND_URL } from "../constants/config";

export const validateForm = (formData, setErrors) => {
  const newErrors = {};

  // Username validation
  if (!formData.username) {
    newErrors.username = "Username is required";
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const handleLoginSubmit = async (e, {
  formData,
  validateForm,
  setIsLoading,
  setErrors,
  onLogin,
}) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});

  if (!validateForm()) {
    setIsLoading(false);
    return;
  }

  try {
    console.log("🔄 Logging in...");
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("📡 Response status:", response.status);
    const result = await response.json();
    console.log("📦 Login response:", result);

    if (result.isSuccess) {
      console.log("✅ Login successful");
      // Store token and user data
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      // Call the onLogin callback
      if (onLogin) {
        onLogin(result.data.user);
      }
    } else {
      console.error("❌ Login failed:", result.message);
      setErrors({
        general: result.message || "Login failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    setErrors({
      general: error.message || "Login failed. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};