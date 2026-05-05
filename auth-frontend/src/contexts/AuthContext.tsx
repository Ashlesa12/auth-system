import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchWithAuth } from "../api/api";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetchWithAuth("/dashboard");
          const data = await res.json();
          setUser({ id: data.user.user_id, email: data.user.email });
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      const res = await fetchWithAuth("/dashboard");
      const data = await res.json();
      setUser({ id: data.user.user_id, email: data.user.email });
    } catch (error) {
      console.error("Failed to fetch user after login", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};