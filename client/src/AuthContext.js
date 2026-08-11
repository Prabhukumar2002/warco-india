import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "warco_admin_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null); // { username, role }
  const [checking, setChecking] = useState(true);

  // Validate any stored token against the server on load, so an expired
  // or tampered token doesn't silently look "logged in".
  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("https://warco-india.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("invalid session");
        const data = await res.json();
        if (!cancelled) setUser({ username: data.username, role: data.role });
      } catch {
        if (!cancelled) {
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (username, password) => {
    const res = await fetch("https://warco-india.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Login failed.");
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({ username: data.username, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      checking,
      login,
      logout,
    }),
    [token, user, checking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
