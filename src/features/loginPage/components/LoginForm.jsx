import React from "react";
import { Paper, Box, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";
import LoginHeader from "./LoginHeader";
import LoginFields from "./LoginFields";
import SubmitButton from "./SubmitButton";
import { itemVariants } from "../constants/animations";
import { validateForm, handleLoginSubmit } from "../utils/formUtils";

const LoginForm = ({
  formData,
  errors,
  isLoading,
  showPassword,
  onInputChange,
  onTogglePassword,
  onLogin,
  setErrors,
  setIsLoading,
}) => {
  const theme = useTheme();

  const handleSubmit = (e) => {
    handleLoginSubmit(e, {
      formData,
      validateForm: () => validateForm(formData, setErrors),
      setIsLoading,
      setErrors,
      onLogin,
    });
  };

  return (
    <Paper
      elevation={8}
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      sx={{
        p: 4,
        borderRadius: 3,
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
        backdropFilter: "blur(8px)",
        background: alpha(theme.palette.background.paper, 0.9),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <LoginHeader />
      
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <LoginFields
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          showPassword={showPassword}
          onInputChange={onInputChange}
          onTogglePassword={onTogglePassword}
        />
        
        <motion.div variants={itemVariants}>
          <SubmitButton isLoading={isLoading} />
        </motion.div>
      </Box>
    </Paper>
  );
};

export default LoginForm;