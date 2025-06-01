import React from "react";
import { TextField, InputAdornment, useTheme, alpha } from "@mui/material";
import { PersonOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import { itemVariants } from "../constants/animations";

const UsernameField = ({ value, error, isLoading, onChange }) => {
  const theme = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        id="username"
        name="username"
        label="Username"
        placeholder="Enter your username"
        autoComplete="username"
        autoFocus
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error || " "}
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
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          },
        }}
      />
    </motion.div>
  );
};

export default UsernameField;