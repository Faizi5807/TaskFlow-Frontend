import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { IAuthUser } from "../config/interfaces/auth";
import {
  getToken,
  getUser,
  setToken,
  setUser as storeSetUser,
  clearAuth,
} from "./auth-store";

interface AuthContextType {
  user: IAuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: IAuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<IAuthUser | null>(getUser());
  const [token, setTokenState] = useState<string | null>(getToken());

  const login = useCallback((newToken: string, newUser: IAuthUser) => {
    setToken(newToken);
    storeSetUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
