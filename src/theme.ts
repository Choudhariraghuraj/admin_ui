import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // Deep blue
    },
    secondary: {
      main: "#f50057", // Pinkish
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif`,
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          animation: "fadeInUp 0.5s ease",
        },
      },
    },
  },
});

export default theme;
