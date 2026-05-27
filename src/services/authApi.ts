import { ApiClientError, apiRequest, ApiResponse } from "./apiClient";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  emailConfirmed: boolean;
};

export type AuthTokenResponse = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
};

export type CurrentUserResponse = AuthUser;

export type LoginPayload = {
  email: string;
  password: string;
  deviceId?: string;
  deviceName?: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  displayName?: string;
  deviceId?: string;
  deviceName?: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
  deviceId?: string;
  deviceName?: string;
};

export type LogoutPayload = {
  refreshToken: string;
};

export type LogoutResponse = {
  succeeded: boolean;
};

export type AuthErrorMessages = {
  fallback: string;
  network: string;
  timeout: string;
  invalidRegisterRequest: string;
  weakPassword: string;
  emailAlreadyExists: string;
  invalidCredentials: string;
  accountDisabled: string;
  invalidRefreshToken: string;
  invalidAccessToken: string;
  userNotFound: string;
};

export async function login(payload: LoginPayload) {
  const response = await apiRequest<ApiResponse<AuthTokenResponse>>(
    "/api/auth/login",
    {
      method: "POST",
      auth: false,
      body: payload,
    },
  );

  return unwrap(response);
}

export async function register(payload: RegisterPayload) {
  const response = await apiRequest<ApiResponse<AuthTokenResponse>>(
    "/api/auth/register",
    {
      method: "POST",
      auth: false,
      body: payload,
    },
  );

  return unwrap(response);
}

export async function refreshSession(payload: RefreshTokenPayload) {
  const response = await apiRequest<ApiResponse<AuthTokenResponse>>(
    "/api/auth/refresh-token",
    {
      method: "POST",
      auth: false,
      body: payload,
    },
  );

  return unwrap(response);
}

export async function logout(payload: LogoutPayload) {
  const response = await apiRequest<ApiResponse<LogoutResponse>>(
    "/api/auth/logout",
    {
      method: "POST",
      body: payload,
    },
  );

  return unwrap(response);
}

export async function getCurrentUser() {
  const response =
    await apiRequest<ApiResponse<CurrentUserResponse>>("/api/auth/me");

  return unwrap(response);
}

export function getAuthErrorMessage(
  error: unknown,
  messages: AuthErrorMessages,
) {
  if (error instanceof ApiClientError) {
    const body = error.body as ApiResponse<unknown> | null | undefined;
    const code = body?.error?.code;

    if (code) {
      return mapAuthErrorCode(code, messages);
    }

    if (error.status === 401) {
      return messages.invalidCredentials;
    }

    if (error.status === 403) {
      return messages.accountDisabled;
    }

    return messages.fallback;
  }

  if (isAbortError(error)) {
    return messages.timeout;
  }

  if (isNetworkError(error)) {
    return messages.network;
  }

  return messages.fallback;
}

function unwrap<T>(response: ApiResponse<T>) {
  if (!response.succeeded || !response.data) {
    throw new ApiClientError("API request failed", 200, response);
  }

  return response.data;
}

function mapAuthErrorCode(code: string, messages: AuthErrorMessages) {
  switch (code) {
    case "invalid_register_request":
      return messages.invalidRegisterRequest;
    case "weak_password":
      return messages.weakPassword;
    case "email_already_exists":
      return messages.emailAlreadyExists;
    case "invalid_credentials":
      return messages.invalidCredentials;
    case "account_disabled":
      return messages.accountDisabled;
    case "invalid_refresh_token":
      return messages.invalidRefreshToken;
    case "invalid_access_token":
      return messages.invalidAccessToken;
    case "user_not_found":
      return messages.userNotFound;
    default:
      return messages.fallback;
  }
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function isNetworkError(error: unknown) {
  if (error instanceof TypeError) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("network request failed")
  );
}
