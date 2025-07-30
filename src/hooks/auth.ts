import { useContext } from "react";
import { AuthContext } from "../context/authcontext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
  }
  return context;
}