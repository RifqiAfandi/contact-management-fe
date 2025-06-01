import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

const SubmitButton = ({ isLoading }) => {
  const theme = useTheme();

  return (
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
        boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.5)}`,
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
          <Typography variant="button" sx={{ visibility: "hidden" }}>
            Sign In
          </Typography>
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
};

export default SubmitButton;