import { getAccessToken } from "./tokenStorage";

export type ApiResponse<T> = {
  succeeded: boolean;
  data: T | null;
  error: ApiErrorResponse | null;
};

export type ApiErrorResponse = {
  code: string;
  message: string;
  traceId?: string;
  correlationId?: string;
  details?: Record<string, string[]>;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
  }
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:5296";

const baseUrl = API_BASE_URL;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  timeoutMs?: number;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const token = options.auth === false ? null : await getAccessToken();
  const headers = new Headers(options.headers);
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 15_000,
  );

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      headers,
      signal: options.signal ?? controller.signal,
    });

    if (!response.ok) {
      const errorBody = await readJson(response);
      throw new ApiClientError(
        "API request failed",
        response.status,
        errorBody,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiFormRequest<T>(
  path: string,
  formData: FormData,
  options: Omit<RequestInit, "body"> & {
    auth?: boolean;
    timeoutMs?: number;
  } = {},
) {
  const token = options.auth === false ? null : await getAccessToken();
  const headers = new Headers(options.headers);
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 20_000,
  );

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      body: formData,
      headers,
      signal: options.signal ?? controller.signal,
    });

    if (!response.ok) {
      const errorBody = await readJson(response);
      throw new ApiClientError(
        "API request failed",
        response.status,
        errorBody,
      );
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
