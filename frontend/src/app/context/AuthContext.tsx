// Context autentikasi StudyWise. Menyimpan user + token mock di sessionStorage.
// Saat backend siap, token nyata dari /auth/login akan dipakai pada header Authorization.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as authService from "../services/authService";
import type { LoginCredentials, RegisterData, User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persist(token: string, user: User) {
  try {
    sessionStorage.setItem("studywise_token", token);
    sessionStorage.setItem("studywise_user", JSON.stringify(user));
  } catch {
    /* abaikan */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Pulihkan sesi dari sessionStorage saat aplikasi dimuat.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("studywise_user");
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* abaikan */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(credentials) {
        setLoading(true);
        try {
          const res = await authService.login(credentials);
          persist(res.token, res.user);
          setUser(res.user);
          return res.user;
        } finally {
          setLoading(false);
        }
      },
      async register(data) {
        setLoading(true);
        try {
          const res = await authService.register(data);
          persist(res.token, res.user);
          setUser(res.user);
          return res.user;
        } finally {
          setLoading(false);
        }
      },
      logout() {
        authService.logout();
        setUser(null);
      },
      updateUser(updated) {
        setUser(updated);
        try {
          sessionStorage.setItem("studywise_user", JSON.stringify(updated));
        } catch {
          /* abaikan */
        }
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
