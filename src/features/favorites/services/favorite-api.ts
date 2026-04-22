import { apiClient } from '@/src/lib/api/api-client';
import type { FavoriteJobsResponse } from '@/src/features/favorites/types';
import type { ApiEnvelope } from '@/src/features/auth/types';

export function getFavoriteJobs(limit = 100) {
  return apiClient.get<FavoriteJobsResponse>('/user/favorite-jobs', { page: 1, limit });
}

export function saveFavoriteJob(jobId: string) {
  return apiClient.post<ApiEnvelope<{ job_id: string; favorited: boolean }>>(`/user/favorite-jobs/${jobId}`);
}

export function removeFavoriteJob(jobId: string) {
  return apiClient.delete<ApiEnvelope<{ job_id: string; favorited: boolean }>>(`/user/favorite-jobs/${jobId}`);
}
