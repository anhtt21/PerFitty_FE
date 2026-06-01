import { ApiClientError, apiRequest, ApiResponse } from "./apiClient";

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

function unwrap<T>(response: ApiResponse<T>) {
  if (!response.succeeded || !response.data) {
    throw new ApiClientError("API request failed", 200, response);
  }

  return response.data;
}
