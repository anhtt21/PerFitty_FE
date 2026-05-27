import * as SecureStore from "expo-secure-store";

const accessTokenKey = "perfitty.accessToken";
const refreshTokenKey = "perfitty.refreshToken";

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string;
};

export async function saveSessionTokens(tokens: SessionTokens) {
  await SecureStore.setItemAsync(accessTokenKey, tokens.accessToken);

  if (tokens.refreshToken) {
    await SecureStore.setItemAsync(refreshTokenKey, tokens.refreshToken);
  }
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(accessTokenKey);
}

export async function clearSessionTokens() {
  await SecureStore.deleteItemAsync(accessTokenKey);
  await SecureStore.deleteItemAsync(refreshTokenKey);
}
