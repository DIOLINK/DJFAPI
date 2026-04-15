import { useCallback } from "react";
import { authStore } from "../store/authStore";
import type { User } from "../types";

interface UseAuth {
  user: User | null;
  token: string | null;
  loginGoogle: (token: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuth {
  const user = authStore((s) => s.user);
  const token = authStore((s) => s.token);
  const setUser = authStore((s) => s.setUser);
  const setToken = authStore((s) => s.setToken);
  const clearAuth = authStore((s) => s.clearAuth);

  // Login real: pide a backend validar token Google, responde usuario y token propio
  const loginGoogle = useCallback(async (googleToken: string) => {
    try {
      const { user, token } = await (await import('../api/AuthService')).AuthService.loginGoogle(googleToken);
      setToken(token);
      setUser(user);
    } catch (e: any) {
      setToken(null);
      setUser(null);
      throw e;
    }
  }, [setToken, setUser]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return { user, token, loginGoogle, logout };
}
