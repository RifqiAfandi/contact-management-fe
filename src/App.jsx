import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import theme from "./styles/theme";
import "./App.css";

// Component imports
import Login from "./features/loginPage/LoginPage";
import AdminDashboard from "./features/adminDashboard/AdminDashboard";
import CashierPage from "./features/cashierPage/CashierPage";
import Gudang from "./features/warehousePage/WarehousePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

// Page transition animation
const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Animated route component
const AnimatedRoute = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    style={{ width: "100%", height: "100%" }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const location = useLocation();

  // Don't apply container styling for admin dashboard and certain other routes
  const isFullWidthRoute = ["/admin", "/kasir", "/gudang"].includes(location.pathname);

  return (
    <Box 
      sx={{ 
        width: "100%", 
        height: "100vh",
        bgcolor: "background.default",
        overflow: "hidden"
      }}
    >
      <AnimatePresence mode="wait">        <Routes location={location} key={location.pathname}>
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
            element={
              <AnimatedRoute>
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              </AnimatedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AnimatedRoute>
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              </AnimatedRoute>
            }
          />
          <Route
            path="/kasir"
            element={
              <AnimatedRoute>
                <ProtectedRoute allowedRoles={['kasir']}>
                  <CashierPage />
                </ProtectedRoute>
              </AnimatedRoute>
            }
          />          <Route
            path="/gudang"
            element={
              <AnimatedRoute>
                <ProtectedRoute allowedRoles={['gudang']}>
                  <Gudang />
                </ProtectedRoute>
              </AnimatedRoute>
            }
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
      </AnimatePresence>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Provides consistent baseline styles across browsers */}
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
