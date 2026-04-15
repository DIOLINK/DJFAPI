// src/components/ThemeToggle.tsx
import { useThemeStore } from '../stores/useThemeStore';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <button
      className={
        'theme-toggle ' + (theme === 'dark' ? 'theme-toggle-dark' : 'theme-toggle-light')
      }
      aria-label="Cambiar claro/oscuro"
      onClick={toggleTheme}
      type="button"
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
