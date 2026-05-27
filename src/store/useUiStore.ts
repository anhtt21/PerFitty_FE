import { create } from "zustand";

export type ColorMode = "light" | "dark";
export type AppLanguage = "vi" | "en";

type UiState = {
  selectedWardrobeCategory: string;
  colorMode: ColorMode;
  language: AppLanguage;
  setSelectedWardrobeCategory: (category: string) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  setLanguage: (language: AppLanguage) => void;
  toggleLanguage: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedWardrobeCategory: "All",
  colorMode: "light",
  language: "vi",
  setSelectedWardrobeCategory(category) {
    set({ selectedWardrobeCategory: category });
  },
  setColorMode(mode) {
    set({ colorMode: mode });
  },
  toggleColorMode() {
    set((state) => ({
      colorMode: state.colorMode === "light" ? "dark" : "light",
    }));
  },
  setLanguage(language) {
    set({ language });
  },
  toggleLanguage() {
    set((state) => ({
      language: state.language === "vi" ? "en" : "vi",
    }));
  },
}));
