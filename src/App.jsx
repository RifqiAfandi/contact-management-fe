import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function AppContent() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  // Don't apply container styling for admin dashboard
  const isAdminRoute = location.pathname === "/admin";

  return (
    <div className={isAdminRoute ? "" : "app-default"}>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/dashboard"
          element={<div>User Dashboard</div>}
        />
        {/* Catch all route */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
