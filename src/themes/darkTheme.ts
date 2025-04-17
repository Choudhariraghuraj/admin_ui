import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark" as PaletteMode,
    primary: {
      main: "#1e1e2f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#1e1e2f",
      paper: "#2a2a3d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#cccccc",
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
          backgroundColor: "#1e1e2f",
        },
        "input:-webkit-autofill": {
          boxShadow: "0 0 0 1000px #2a2a3d inset !important",
          WebkitTextFillColor: "#ffffff !important",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#ffffff",
          },
          "& .MuiInputBase-root": {
            backgroundColor: "#2a2a3d",
            color: "#ffffff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#444",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#666",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#888",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#2a2a3d",
          color: "#ffffff",
          "& input:-webkit-autofill": {
            boxShadow: "0 0 0 1000px #2a2a3d inset",
            WebkitTextFillColor: "#ffffff",
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
          color: "#90caf9",
          textDecorationColor: "#90caf9",
          "&:hover": {
            color: "#bbdefb",
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export default darkTheme;
