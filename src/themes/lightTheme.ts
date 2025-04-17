import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light" as PaletteMode,
    primary: {
      main: "#1e1e2f", // Keep brand identity
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e1e2f",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif`,
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f5f5f5",
        },
        "input:-webkit-autofill": {
          boxShadow: "0 0 0 1000px #ffffff inset !important",
          WebkitTextFillColor: "#1e1e2f !important",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#1e1e2f",
          },
          "& .MuiInputBase-root": {
            backgroundColor: "#ffffff",
            color: "#1e1e2f",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#999",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1e1e2f",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1e1e2f",
          "& input:-webkit-autofill": {
            boxShadow: "0 0 0 1000px #ffffff inset",
            WebkitTextFillColor: "#1e1e2f",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          animation: "fadeInUp 0.5s ease",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#1976d2",
          textDecorationColor: "#1976d2",
          "&:hover": {
            color: "#1565c0",
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export default lightTheme;
