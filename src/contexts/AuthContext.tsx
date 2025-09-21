"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  companies?: Company[];
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  sector: "ecommerce" | "healthcare" | "finance" | "education";
  targetRaise: number;
  revenue: number;
  kycVerified: boolean;
  financialsLinked: boolean;
  user?: User;
  documents?: Document[];
}

export interface Document {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  company?: Company;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
      logout();
    }
  }

  const login = async (newToken: string) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
    await fetchUser();
    router.push("/dashboard");
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};