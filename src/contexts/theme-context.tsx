"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  THEMES,
  DEFAULT_THEME_ID,
  getTheme,
  type Theme,
} from "@/lib/themes";

interface ThemeContextValue {
  currentTheme: Theme;
  setTheme: (id: string) => void;
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  previewTheme: (id: string | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeToDOM(theme: Theme) {
  const el = document.documentElement;
  const c = theme.colors;
  el.setAttribute("data-theme", theme.id);
  el.setAttribute("data-color-mode", theme.dark ? "dark" : "light");
  el.style.setProperty("--color-base", c.base);
  el.style.setProperty("--color-mantle", c.mantle);
  el.style.setProperty("--color-crust", c.crust);
  el.style.setProperty("--color-surface-0", c.surface0);
  el.style.setProperty("--color-surface-1", c.surface1);
  el.style.setProperty("--color-surface-2", c.surface2);
  el.style.setProperty("--color-overlay-0", c.overlay0);
  el.style.setProperty("--color-overlay-1", c.overlay1);
  el.style.setProperty("--color-subtext-0", c.subtext0);
  el.style.setProperty("--color-subtext-1", c.subtext1);
  el.style.setProperty("--color-text", c.text);
  el.style.setProperty("--color-peach", c.peach);
  el.style.setProperty("--color-green", c.green);
  el.style.setProperty("--color-blue", c.blue);
  el.style.setProperty("--color-lavender", c.lavender);
  el.style.setProperty("--color-mauve", c.mauve);
  el.style.setProperty("--color-red", c.red);
  el.style.setProperty("--color-yellow", c.yellow);
  el.style.setProperty("--color-teal", c.teal);
  el.style.setProperty("--color-rosewater", c.rosewater);
  el.style.setProperty("--color-flamingo", c.flamingo);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [panelOpen, setPanelOpen] = useState(false);

  // On mount, read from localStorage and apply
  useEffect(() => {
    const saved = localStorage.getItem("site-theme");
    if (saved) {
      const theme = getTheme(saved);
      if (theme) {
        setThemeId(saved);
        applyThemeToDOM(theme);
        return;
      }
    }
    // Apply default explicitly (clears any flash from script)
    const def = getTheme(DEFAULT_THEME_ID)!;
    applyThemeToDOM(def);
  }, []);

  const setTheme = useCallback((id: string) => {
    const theme = getTheme(id);
    if (!theme) return;
    setThemeId(id);
    applyThemeToDOM(theme);
    localStorage.setItem("site-theme", id);
  }, []);

  const previewTheme = useCallback((id: string | null) => {
    if (id === null) {
      // Revert to saved theme
      const saved = localStorage.getItem("site-theme") || DEFAULT_THEME_ID;
      const theme = getTheme(saved);
      if (theme) applyThemeToDOM(theme);
    } else {
      const theme = getTheme(id);
      if (theme) applyThemeToDOM(theme);
    }
  }, []);

  const currentTheme = getTheme(themeId) ?? THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        panelOpen,
        openPanel: () => setPanelOpen(true),
        closePanel: () => setPanelOpen(false),
        previewTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
