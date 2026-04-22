import { apiClient } from '@/src/lib/api/api-client';
import type { AppliedJobsResponse } from '@/src/features/applied-jobs/types';

export function getMyAppliedJobs() {
  return apiClient.get<AppliedJobsResponse>('/jobs/me/applied');
}
