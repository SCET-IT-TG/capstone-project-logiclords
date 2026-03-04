import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  // 🔥 Safe theme initialization
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;

    // default theme
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
};