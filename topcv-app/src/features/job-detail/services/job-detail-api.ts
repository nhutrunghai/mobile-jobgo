import { apiClient } from '@/src/lib/api/api-client';
import type { PublicJobDetailResponse } from '@/src/features/job-detail/types';
import type { ApiEnvelope } from '@/src/features/auth/types';

export function getPublicJobDetail(jobId: string) {
  return apiClient.get<PublicJobDetailResponse>(`/jobs/${jobId}`);
}

export function withdrawMyJobApplication(jobId: string) {
  return apiClient.patch<ApiEnvelope<{
    _id?: string;
    job_id?: string;
    status?: string;
    updated_at?: string;
  }>>(`/jobs/${jobId}/withdraw`);
}
