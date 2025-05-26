import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle auth state changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (!token || !storedUser) {
          setUser(null);
          if (location.pathname !== '/login') {
            navigate("/login");
          }
          return;
        }

        await apiClient.validateToken(token);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        if (location.pathname === '/login') {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        if (location.pathname !== '/login') {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiClient.login(username, password);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Successfully logged out!");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};