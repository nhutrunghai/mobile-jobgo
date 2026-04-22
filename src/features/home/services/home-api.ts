import { apiClient } from '@/src/lib/api/api-client';
import type { PublicHomeJobListResponse } from '@/src/features/home/types';

export function getFeaturedHomeJobs(limit = 4) {
  return apiClient.get<PublicHomeJobListResponse>('/jobs/featured', { page: 1, limit });
}

export function getLatestHomeJobs(limit = 4) {
  return apiClient.get<PublicHomeJobListResponse>('/jobs/latest', { page: 1, limit });
}
