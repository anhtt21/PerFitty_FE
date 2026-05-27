import { useQuery } from "@tanstack/react-query";
import { getApiHealth } from "../services/healthApi";

export function useApiHealth() {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: getApiHealth
  });
}
