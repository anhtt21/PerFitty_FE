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
    public readonly body?: unknown
  ) {
    super(message);
  }
}

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:5296";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const token = await getAccessToken();
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    headers
  });

  if (!response.ok) {
    const errorBody = await readJson(response);
    throw new ApiClientError("API request failed", response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
