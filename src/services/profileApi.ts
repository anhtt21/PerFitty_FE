import { Platform } from "react-native";
import {
  API_BASE_URL,
  ApiClientError,
  apiFormRequest,
  apiRequest,
  ApiResponse,
} from "./apiClient";

export type ProfileResponse = {
  userId: string;
  displayName: string;
  avatarObjectKey: string | null;
  gender: string | null;
  heightCm: number | null;
  bodyShape: string | null;
};

export type UpdateProfilePayload = {
  displayName: string;
  avatarObjectKey?: string | null;
  gender?: string | null;
  heightCm?: number | null;
  bodyShape?: string | null;
};

export type UploadAvatarInput = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

export type StylePreferencesResponse = {
  preferredStyles: string[];
  preferredOccasions: string[];
  favoriteColors: string[];
  avoidedColors: string[];
  availableStyles: string[];
  availableOccasions: string[];
};

export type UpdateStylePreferencesPayload = {
  preferredStyles: string[];
  preferredOccasions: string[];
  favoriteColors: string[];
  avoidedColors: string[];
};

export async function getProfile() {
  const response =
    await apiRequest<ApiResponse<ProfileResponse>>("/api/profile");

  return unwrap(response);
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await apiRequest<ApiResponse<ProfileResponse>>(
    "/api/profile",
    {
      method: "PUT",
      body: payload,
      timeoutMs: 8_000,
    },
  );

  return unwrap(response);
}

export async function uploadProfileAvatar(input: UploadAvatarInput) {
  const formData = new FormData();
  const fileName = input.fileName ?? `avatar-${Date.now()}.jpg`;
  const mimeType = input.mimeType ?? "image/jpeg";

  if (Platform.OS === "web") {
    const response = await fetch(input.uri);
    const blob = await response.blob();
    formData.append("file", blob, fileName);
  } else {
    formData.append("file", {
      uri: input.uri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);
  }

  const response = await apiFormRequest<ApiResponse<ProfileResponse>>(
    "/api/profile/avatar",
    formData,
    {
      method: "POST",
      timeoutMs: 20_000,
    },
  );

  return unwrap(response);
}

export async function getStylePreferences() {
  const response = await apiRequest<ApiResponse<StylePreferencesResponse>>(
    "/api/profile/style-preferences",
  );

  return unwrap(response);
}

export async function updateStylePreferences(
  payload: UpdateStylePreferencesPayload,
) {
  const response = await apiRequest<ApiResponse<StylePreferencesResponse>>(
    "/api/profile/style-preferences",
    {
      method: "PUT",
      body: payload,
      timeoutMs: 8_000,
    },
  );

  return unwrap(response);
}

export function resolveAvatarUrl(profile?: ProfileResponse | null) {
  const key = profile?.avatarObjectKey;

  if (!key) {
    return null;
  }

  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }

  return `${API_BASE_URL}/${key.replace(/^\/+/, "")}`;
}

function unwrap<T>(response: ApiResponse<T>) {
  if (!response.succeeded || !response.data) {
    throw new ApiClientError("API request failed", 200, response);
  }

  return response.data;
}
