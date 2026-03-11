// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken } from "../lib/axios";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, try to restore session using the refresh token cookie
    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/auth/refresh",
        {},
        { withCredentials: true },
      )
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
      })
      .catch(() => {
        // No valid refresh token, user needs to log in
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (accessToken, userData) => {
    setAccessToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
