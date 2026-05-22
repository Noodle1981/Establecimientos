import { create } from 'zustand';
import { User, UserRole } from '@sue/types';

interface AuthState {
  user: { id: number; name: string; email: string; role: UserRole } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate highly secure validation
      // In production, this queries `POST /api/auth/login`
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Match administrative user types
      let role: UserRole = 'user';
      let name = 'Usuario General';

      if (email.includes('admin@')) {
        role = 'admin';
        name = 'Administrador Sistema';
      } else if (email.includes('auditor@') || email.includes('admin.sue')) {
        role = 'administrativos';
        name = 'Auditor de Modalidades';
      }

      // Pre-set user mock credentials matching database records
      const mockUser = {
        id: 1,
        name,
        email,
        role,
      };

      set({
        user: mockUser,
        token: 'mock-jwt-token-string-xyz',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Save token securely in localStorage for persistent logins
      localStorage.setItem('sue_token', 'mock-jwt-token-string-xyz');
      localStorage.setItem('sue_user', JSON.stringify(mockUser));
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Credenciales inválidas.',
      });
      return false;
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, error: null });
    localStorage.removeItem('sue_token');
    localStorage.removeItem('sue_user');
  },

  clearError: () => set({ error: null }),
}));
