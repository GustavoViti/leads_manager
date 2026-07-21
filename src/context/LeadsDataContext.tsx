import { createContext, useContext, ReactNode } from "react";
import { useLeadsData } from "@/hooks/useLeadsData";

type LeadsDataValue = ReturnType<typeof useLeadsData>;

const LeadsDataContext = createContext<LeadsDataValue | null>(null);

export function LeadsDataProvider({ children }: { children: ReactNode }) {
  const value = useLeadsData();
  return <LeadsDataContext.Provider value={value}>{children}</LeadsDataContext.Provider>;
}

export function useLeadsDataContext(): LeadsDataValue {
  const ctx = useContext(LeadsDataContext);
  if (!ctx) throw new Error("useLeadsDataContext deve ser usado dentro de um LeadsDataProvider");
  return ctx;
}
