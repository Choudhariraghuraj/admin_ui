import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, PaletteMode, CssBaseline, GlobalStyles } from "@mui/material";
import darkTheme from "../themes/darkTheme";
import lightTheme from "../themes/lightTheme";

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  toggleColorMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(
    (localStorage.getItem("themeMode") as PaletteMode) || "dark"
  );

  const toggleColorMode = () => {
    setMode((prev) => {
      const newMode = prev === "dark" ? "light" : "dark";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => (mode === "dark" ? darkTheme : lightTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      }}
    />
        {children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
