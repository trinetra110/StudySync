/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from "react";
import { authenticate, registerUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("studysync-user");
    return saved ? JSON.parse(saved) : null;
  });
  const login = (email, password) => {
    const result = authenticate(email, password);
    if (result.error) return result;
    setCurrentUser(result.user);
    localStorage.setItem("studysync-user", JSON.stringify(result.user));
    return result;
  };
  const signup = (details) => {
    const result = registerUser(details);
    if (result.error) return result;
    setCurrentUser(result.user);
    localStorage.setItem("studysync-user", JSON.stringify(result.user));
    return result;
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("studysync-user");
  };
  const obj = useMemo(
    () => ({ currentUser, login, signup, logout }),
    [currentUser],
  );
  return <AuthContext.Provider value={obj}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
