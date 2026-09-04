import { useContext } from "react";
import { AppDataContext } from "./AppDataContext";

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData moet binnen een AppDataProvider gebruikt worden");
  }
  return ctx;
}
