import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const BACKEND_URL = "http://localhost:3000";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("=== LOGIN RESPONSE ===");
      console.log("Response data:", data);
      console.log("data.data:", data.data);

      if (!response.ok || !data.isSuccess) {
        throw new Error(data.message || "Login gagal");
      }

      // Akses data dari response structure: data.data.token dan data.data.user
      const { token, user } = data.data;

      console.log("Extracted token:", token);
      console.log("Extracted user:", user);

      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved");
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        console.log("✅ User saved:", user);
        console.log("User role:", user.role);

        // Navigate berdasarkan role
        if (user.role === "admin") {
          console.log("🚀 Navigating to admin...");
          navigate("/admin");
        } else {
          console.log("🚀 Navigating to dashboard...");
          navigate("/dashboard");
        }
      } else {
        setError("Data user tidak ditemukan");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">Please login to your account</p>
      <form
        onSubmit={handleSubmit}
        className="login-form"
      >
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={loading}
        />

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="login-footer">
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
