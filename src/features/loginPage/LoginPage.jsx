import React, { useState } from "react";
import { Container, Box, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";
import LoginForm from "./components/LoginForm";
import BackgroundOverlay from "./components/BackgroundOverlay";
import { containerVariants } from "./constants/animations";

const Login = ({ onLogin }) => {
  const theme = useTheme();
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        backgroundColor: alpha(theme.palette.primary.light, 0.02),
      }}
    >
      <BackgroundOverlay />
      
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <LoginForm
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            showPassword={showPassword}
            onInputChange={handleInputChange}
            onTogglePassword={togglePasswordVisibility}
            onLogin={onLogin}
            setErrors={setErrors}
            setIsLoading={setIsLoading}
          />
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;