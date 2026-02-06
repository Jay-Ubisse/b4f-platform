"use client";

import { createContext, useContext, useEffect, useState } from "react";

import api from "@/lib/axios";
import { UserProps } from "@/app/types/user";

type AuthContextType = {
  user: UserProps | null;
  loading: boolean;
  setUser: (user: UserProps | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  // Reidratar usuário com base no cookie HttpOnly
  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
