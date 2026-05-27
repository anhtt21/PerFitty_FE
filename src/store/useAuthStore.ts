import { Platform } from "react-native";
import { create } from "zustand";
import {
  AuthUser,
  getCurrentUser,
  logout,
  refreshSession,
} from "../services/authApi";
import {
  clearSessionTokens,
  getRefreshToken,
  getSessionTokens,
  saveSessionTokens,
  SessionTokens,
} from "../services/tokenStorage";

type AuthStatus = "checking" | "authenticated" | "guest";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  status: AuthStatus;
  isSignedIn: boolean;
  bootstrapAuth: () => Promise<void>;
  setSession: (tokens: SessionTokens, user?: AuthUser) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  status: "checking",
  isSignedIn: false,

  async bootstrapAuth() {
    set({ status: "checking" });

    let tokens: SessionTokens | null = null;

    try {
      tokens = await getSessionTokens();
    } catch {
      await clearSessionTokens();
      setGuest(set);
      return;
    }

    if (!tokens) {
      setGuest(set);
      return;
    }

    set({
      accessToken: tokens.accessToken,
      status: "checking",
      isSignedIn: false,
    });

    try {
      const user = await getCurrentUser();

      set({
        accessToken: tokens.accessToken,
        user,
        status: "authenticated",
        isSignedIn: true,
      });
      return;
    } catch {
      if (!tokens.refreshToken) {
        await clearSessionTokens();
        setGuest(set);
        return;
      }
    }

    try {
      const refreshed = await refreshSession({
        refreshToken: tokens.refreshToken,
        deviceId: "perfitty-mobile",
        deviceName: Platform.OS,
      });

      await saveSessionTokens({
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
      });

      set({
        accessToken: refreshed.accessToken,
        user: refreshed.user,
        status: "authenticated",
        isSignedIn: true,
      });
    } catch {
      await clearSessionTokens();
      setGuest(set);
    }
  },

  async setSession(tokens, user) {
    await saveSessionTokens(tokens);

    set({
      accessToken: tokens.accessToken,
      user: user ?? null,
      status: "authenticated",
      isSignedIn: true,
    });
  },

  setUser(user) {
    set({ user });
  },

  async signOut() {
    const refreshToken = await getRefreshToken();

    if (refreshToken && get().accessToken) {
      try {
        await logout({ refreshToken });
      } catch {
        // Local logout should still complete even if the API call fails.
      }
    }

    await clearSessionTokens();

    set({
      accessToken: null,
      user: null,
      status: "guest",
      isSignedIn: false,
    });
  },
}));

function setGuest(set: (state: Partial<AuthState>) => void) {
  set({
    accessToken: null,
    user: null,
    status: "guest",
    isSignedIn: false,
  });
}
