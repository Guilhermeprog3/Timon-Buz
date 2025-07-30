import { useContext } from "react";
import { LinhaContext } from "../context/linhacontext";

export const useLinhas = () => {
  const context = useContext(LinhaContext);
  if (!context) {
  }
  return context;
}