import { create } from "zustand";
import { clearSessionTokens, saveSessionTokens, SessionTokens } from "../services/tokenStorage";

type AuthState = {
  accessToken: string | null;
  isSignedIn: boolean;
  setSession: (tokens: SessionTokens) => Promise<void>;
  openAppShell: () => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isSignedIn: false,
  async setSession(tokens) {
    await saveSessionTokens(tokens);
    set({
      accessToken: tokens.accessToken,
      isSignedIn: true
    });
  },
  openAppShell() {
    set({
      accessToken: null,
      isSignedIn: true
    });
  },
  async signOut() {
    await clearSessionTokens();
    set({
      accessToken: null,
      isSignedIn: false
    });
  }
}));
