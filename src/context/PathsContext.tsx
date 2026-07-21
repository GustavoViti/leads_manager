import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { AppFilePaths, EMPTY_PATHS } from "@/types/config";
import { getSavedPaths, savePaths } from "@/services/dataService";

interface PathsContextValue {
  paths: AppFilePaths;
  loading: boolean;
  updatePaths: (partial: Partial<AppFilePaths>) => Promise<void>;
}

const PathsContext = createContext<PathsContextValue | null>(null);

export function PathsProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<AppFilePaths>(EMPTY_PATHS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedPaths()
      .then(setPaths)
      .finally(() => setLoading(false));
  }, []);

  const updatePaths = useCallback(
    async (partial: Partial<AppFilePaths>) => {
      const next = { ...paths, ...partial };
      setPaths(next);
      await savePaths(next);
    },
    [paths]
  );

  return <PathsContext.Provider value={{ paths, loading, updatePaths }}>{children}</PathsContext.Provider>;
}

export function usePaths(): PathsContextValue {
  const ctx = useContext(PathsContext);
  if (!ctx) throw new Error("usePaths deve ser usado dentro de um PathsProvider");
  return ctx;
}
