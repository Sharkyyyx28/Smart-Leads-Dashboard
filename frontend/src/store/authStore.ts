import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('smart_leads_token', token);
    localStorage.setItem('smart_leads_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('smart_leads_token');
    localStorage.removeItem('smart_leads_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('smart_leads_token');
    const userStr = localStorage.getItem('smart_leads_user');
    if (token && userStr) {
      try {
        const user: User = JSON.stringify(userStr) ? JSON.parse(userStr) : null;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('smart_leads_token');
        localStorage.removeItem('smart_leads_user');
        set({ user: null, token: null, isAuthenticated: false });
      }
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
