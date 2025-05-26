import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Container,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
} from "@mui/icons-material";

// Ensure BACKEND_URL is valid
const BACKEND_URL = "http://localhost:3000"; // Use environment variable if available

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const Login = ({ onLogin, onSwitchToRegister }) => {
  const theme = useTheme();
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
    setErrors({});

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
        throw new Error("Login failed. Please check your credentials.");
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

        // Redirect based on user role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "kasir") {
          navigate("/kasir");
        } else if (user.role == "gudang") {
          navigate("/gudang");
        } else {
          throw new Error("Unauthorized role");
        }
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

  // Create dynamic background elements
  const backgroundElements = Array.from({ length: 15 }, (_, i) => (
    <Box
      key={i}
      component={motion.div}
      sx={{
        position: "absolute",
        width: `${Math.random() * 150 + 20}px`,
        height: `${Math.random() * 150 + 20}px`,
        borderRadius: "50%",
        background: alpha(
          theme.palette.primary.main,
          0.05 + Math.random() * 0.1
        ),
        backdropFilter: "blur(4px)",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        zIndex: 0,
      }}
      animate={{
        x: [0, Math.random() * 40 - 20],
        y: [0, Math.random() * 40 - 20],
        scale: [1, Math.random() * 0.3 + 0.8],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: Math.random() * 5 + 10,
      }}
    />
  ));

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
      {/* Dynamic background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {backgroundElements}
      </Box>

      <Container
        maxWidth="sm"
        sx={{ position: "relative", zIndex: 1 }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Paper
            elevation={8}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: `0 8px 32px 0 ${alpha(
                theme.palette.primary.main,
                0.1
              )}`,
              backdropFilter: "blur(8px)",
              background: alpha(theme.palette.background.paper, 0.9),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Logo/Icon */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <PersonOutline
                  color="primary"
                  sx={{ fontSize: 40 }}
                />
              </Box>
            </motion.div>

            {/* Header */}
            <motion.div variants={itemVariants}>
              <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                mb={1}
              >
                Welcome
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                mb={1}
              >
                Contact Caffe & Eatery
              </Typography>
            </motion.div>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              {errors.general && (
                <motion.div variants={itemVariants}>
                  <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                  >
                    {errors.general}
                  </Alert>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  id="username"
                  name="username"
                  label="Username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!errors.username}
                  helperText={errors.username || " "}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease-in-out",
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                    },
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password || " "}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease-in-out",
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                    },
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: `0 4px 14px 0 ${alpha(
                      theme.palette.primary.main,
                      0.39
                    )}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 20px 0 ${alpha(
                        theme.palette.primary.main,
                        0.5
                      )}`,
                    },
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.4) 38%, rgba(255,255,255,0) 47%)",
                      transform: "translateX(-100%)",
                    },
                    "&:hover:after": {
                      animation: "shine 1.5s infinite",
                      "@keyframes shine": {
                        "100%": {
                          transform: "translateX(100%)",
                        },
                      },
                    },
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={24}
                        sx={{
                          color: theme.palette.primary.contrastText,
                          position: "absolute",
                          left: "50%",
                          marginLeft: "-12px",
                        }}
                      />
                      <Typography
                        variant="button"
                        sx={{ visibility: "hidden" }}
                      >
                        Sign In
                      </Typography>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
