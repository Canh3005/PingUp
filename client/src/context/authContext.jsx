/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        console.log(data);
        setUser(data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    if (localStorage.getItem("auth_token")) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export hook separately for Fast Refresh compatibility
export function useAuth() {
  return useContext(AuthContext);
}
