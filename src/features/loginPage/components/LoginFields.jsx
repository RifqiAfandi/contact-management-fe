import React from "react";
import { Alert } from "@mui/material";
import { motion } from "framer-motion";
import UsernameField from "./UsernameField";
import PasswordField from "./PasswordField";
import { itemVariants } from "../constants/animations";

const LoginFields = ({
  formData,
  errors,
  isLoading,
  showPassword,
  onInputChange,
  onTogglePassword,
}) => {
  return (
    <>
      {errors.general && (
        <motion.div variants={itemVariants}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.general}
          </Alert>
        </motion.div>
      )}

      <UsernameField
        value={formData.username}
        error={errors.username}
        isLoading={isLoading}
        onChange={onInputChange}
      />

      <PasswordField
        value={formData.password}
        error={errors.password}
        isLoading={isLoading}
        showPassword={showPassword}
        onChange={onInputChange}
        onToggleVisibility={onTogglePassword}
      />
    </>
  );
};

export default LoginFields;