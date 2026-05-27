import { create } from "zustand";

type UiState = {
  selectedWardrobeCategory: string;
  setSelectedWardrobeCategory: (category: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedWardrobeCategory: "All",
  setSelectedWardrobeCategory(category) {
    set({ selectedWardrobeCategory: category });
  }
}));
