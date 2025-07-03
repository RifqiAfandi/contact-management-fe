import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import { PersonOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import { itemVariants } from "../constants/animations";

const LoginHeader = () => {
  const theme = useTheme();

  return (
    <>
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
          <PersonOutline color="primary" sx={{ fontSize: 40 }} />
        </Box>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
          Welcome
        </Typography>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
          Contact Coffee
        </Typography>
      </motion.div>
    </>
  );
};

export default LoginHeader;
