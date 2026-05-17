import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: localStorage.getItem('smart_leads_theme') === 'dark',
  toggleDarkMode: () =>
    set((state) => {
      const nextMode = !state.isDarkMode;
      if (nextMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('smart_leads_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('smart_leads_theme', 'light');
      }
      return { isDarkMode: nextMode };
    }),
}));
