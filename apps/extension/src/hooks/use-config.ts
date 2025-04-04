import { Style } from "@/registry/styles";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Config = {
  style: Style["name"];
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
};

type ConfigStore = {
  config: Config;
  setStyle: (style: Style["name"]) => void;
  setPackageManager: (packageManager: Config["packageManager"]) => void;
  reset: () => void;
};

// Default configuration
const defaultConfig: Config = {
  style: "default",
  packageManager: "npm",
};

export const useConfig = create<ConfigStore>()(
  persist(
    (set) => ({
      config: { ...defaultConfig },
      setStyle: (style) =>
        set((state) => ({ config: { ...state.config, style } })),
      setPackageManager: (packageManager) =>
        set((state) => ({ config: { ...state.config, packageManager } })),
      reset: () => set({ config: { ...defaultConfig } }),
    }),
    {
      name: "config",
    },
  ),
);
