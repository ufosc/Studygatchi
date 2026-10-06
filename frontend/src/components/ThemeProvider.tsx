import { useState, useEffect, createContext } from 'react';

export type Theme = {
  bg: string;
  text: string;
  card: string;
  button: string;
}

export const themes: Record<string, Theme> = {
    pink: {bg: "#F2B8CF", text: "#4A2B33", card: "#F6D1E6", button: "#4A2B33"},
    green: {bg: "#B7E0A6", text: "#2F3A2D", card: "#D4F5D0", button: "#2F3A2D"},
    lightblue: {bg: "#9bd0ec", text: "#0F2B3A", card:"#C9ECF6", button: "#0F2B3A"},
    white: {bg: "#E8E8E8", text: "#1A1A1A", card: "#d8d6d6", button: "#3A3A3A"},
    black: {bg: "#383838", text: "#F5F5F5", card: "#2A2A2A", button: "#8C8C8C"}
};

type ThemeContextType = {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
    themes: typeof themes;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps){
  const [theme, setTheme] = useState<Theme>(themes.black);

  useEffect(() => {
    console.log("Theme changed:", theme);
    document.documentElement.style.setProperty("--bg-color", theme.bg);
    document.documentElement.style.setProperty("--text-color", theme.text);
    document.documentElement.style.setProperty("--card-bg", theme.card);
    document.documentElement.style.setProperty("--button-bg", theme.button);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value = {{theme, setTheme, themes}}>
      {children}
    </ThemeContext.Provider>
  );
}
