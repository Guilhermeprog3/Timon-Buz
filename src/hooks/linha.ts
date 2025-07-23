import { useContext } from "react";
import { LinhaContext } from "../context/linhacontext";

export const useLinhas = () => {
  const context = useContext(LinhaContext);
  if (!context) {
    throw new Error('useLinhas must be used within a LinhaProvider');
  }
  return context;
}