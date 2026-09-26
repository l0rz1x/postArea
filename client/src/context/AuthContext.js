import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { authApi } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem("accessToken")));

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setToken("");
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem("accessToken");
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.checkAuth();
      if (data && data.userName) {
        setUser({
          id: data.id,
          userName: data.userName,
          fullName: data.fullName || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
          hideUsername: !!data.hideUsername,
        });
        setToken(savedToken);
      } else {
        logout();
      }
    } catch (err) {
      console.warn("Auth check failed:", err.message);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (userName, password) => {
    const data = await authApi.login({ userName, password });
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
      setUser({
        id: data.id,
        userName: data.userName,
        fullName: data.fullName || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
        hideUsername: !!data.hideUsername,
      });
      return data;
    }
    throw new Error(data.error || "Login failed.");
  };

  const register = async (userName, password, fullName) => {
    const data = await authApi.register({ userName, password, fullName });
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
      const newUser = {
        id: data.user?.id || data.id,
        userName: data.user?.userName || data.userName || userName,
        fullName: data.user?.fullName || data.fullName || fullName || "",
        bio: data.user?.bio || data.bio || "",
        avatar: data.user?.avatar || data.avatar || "",
        hideUsername: !!(data.user?.hideUsername ?? data.hideUsername),
      };
      setUser(newUser);
      return data;
    }
    return data;
  };

  const updateUser = (userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : userData));
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      checkAuth,
      updateUser,
      authState: {
        id: user?.id || 0,
        userName: user?.userName || "",
        status: !!user,
      },
      setAuthState: (state) => {
        if (typeof state === "function") {
          const next = state({
            id: user?.id || 0,
            userName: user?.userName || "",
            status: !!user,
          });
          if (next.status) {
            setUser({ id: next.id, userName: next.userName });
          } else {
            setUser(null);
          }
        } else if (state && state.status) {
          setUser({ id: state.id, userName: state.userName });
        } else {
          setUser(null);
        }
      },
    }),
    [user, token, isLoading, checkAuth, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// For backwards compatibility with old import { authContext } from '../helpers/authContext'
export const authContext = AuthContext;
