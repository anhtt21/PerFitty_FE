import { apiRequest, ApiResponse } from "./apiClient";

export type ApiHealthDto = {
  service: string;
  status: string;
  utcNow: string;
};

export function getApiHealth() {
  return apiRequest<ApiResponse<ApiHealthDto>>("/api/health");
}
