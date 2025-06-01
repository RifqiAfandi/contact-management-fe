import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { itemVariants } from "../constants/animations";

const PasswordField = ({
  value,
  error,
  isLoading,
  showPassword,
  onChange,
  onToggleVisibility,
}) => {
  const theme = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        id="password"
        name="password"
        label="Password"
        placeholder="Enter your password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error || " "}
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
                onClick={onToggleVisibility}
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
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          },
        }}
      />
    </motion.div>
  );
};

export default PasswordField;