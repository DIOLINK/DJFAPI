// src/stores/useThemeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Store global para manejar el tema claro/oscuro.
 * Se guarda automáticamente en localStorage.
 */
export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
  (set, /* get */) => ({
    theme: "light",
    toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    setTheme: (theme) => set({ theme }),
  }),
  {
    name: "spa-theme",
  }
));
