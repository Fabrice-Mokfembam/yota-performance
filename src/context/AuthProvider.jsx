import { useState } from "react";
import { AuthContext } from "./AuthContext";




export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem('admin');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('admin');
  });

  const login = (adminData) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin');
  };

  const value = {
    admin,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 