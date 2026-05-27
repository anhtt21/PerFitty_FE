import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const accessTokenKey = "perfitty.accessToken";
const refreshTokenKey = "perfitty.refreshToken";
const memoryStorage = new Map<string, string>();

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string;
};

export async function saveSessionTokens(tokens: SessionTokens) {
  await setItem(accessTokenKey, tokens.accessToken);

  if (tokens.refreshToken) {
    await setItem(refreshTokenKey, tokens.refreshToken);
  }
}

export async function getAccessToken() {
  return getItem(accessTokenKey);
}

export async function getRefreshToken() {
  return getItem(refreshTokenKey);
}

export async function getSessionTokens(): Promise<SessionTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken: refreshToken ?? undefined,
  };
}

export async function clearSessionTokens() {
  await Promise.all([deleteItem(accessTokenKey), deleteItem(refreshTokenKey)]);
}

async function setItem(key: string, value: string) {
  if (Platform.OS === "web") {
    const storage = getWebStorage();

    if (storage) {
      storage.setItem(key, value);
    } else {
      memoryStorage.set(key, value);
    }

    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string) {
  if (Platform.OS === "web") {
    return getWebStorage()?.getItem(key) ?? memoryStorage.get(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (Platform.OS === "web") {
    getWebStorage()?.removeItem(key);
    memoryStorage.delete(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

function getWebStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}
