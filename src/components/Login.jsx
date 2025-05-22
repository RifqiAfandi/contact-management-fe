import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const BACKEND_URL = "http://localhost:3000"; // Replace with your backend URL

const Login = ({ onLogin, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();

      if (data.isSuccess && data.data) {
        const { token, user } = data.data;

        // Store token in localStorage or cookies if needed
        localStorage.setItem("token", token);

        if (onLogin) {
          onLogin(user);
        }

        console.log("Login successful!", user);

        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setErrors({
        general: error.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <div className="icon-circle">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                ></circle>
              </svg>
            </div>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please sign in to your account</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          {errors.general && (
            <div className="error-alert">
              <div className="error-icon">⚠️</div>
              <span>{errors.general}</span>
            </div>
          )}

          <div className="input-group">
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                className={`login-input ${
                  errors.username ? "input-error" : ""
                }`}
                placeholder=" "
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <label
                htmlFor="username"
                className="input-label"
              >
                Username
              </label>
              <div className="input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
            </div>
            {errors.username && (
              <div className="error-text">
                <span className="error-icon">⚠️</span>
                {errors.username}
              </div>
            )}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`login-input ${
                  errors.password ? "input-error" : ""
                }`}
                placeholder=" "
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <label
                htmlFor="password"
                className="input-label"
              >
                Password
              </label>
              <div className="input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <circle
                    cx="12"
                    cy="16"
                    r="1"
                  ></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.84-6.84z"></path>
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                    ></line>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    ></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <div className="error-text">
                <span className="error-icon">⚠️</span>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            <span className="button-text">
              {isLoading ? "Signing in..." : "Sign In"}
            </span>
            {isLoading && <div className="loading-spinner"></div>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
