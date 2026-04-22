import { apiClient } from '@/src/lib/api/api-client';
import type { ApplyJobResponse, CreateResumeResponse, ResumeListResponse } from '@/src/features/job-application/types';

export function getMyResumes() {
  return apiClient.get<ResumeListResponse>('/user/resumes');
}

export function applyToJob(jobId: string, payload: { cv_id: string; cover_letter?: string }) {
  return apiClient.post<ApplyJobResponse>(`/jobs/${jobId}/apply`, payload);
}

export function createResume(payload: {
  title: string;
  cv_url: string;
  resume_file_key: string;
  is_default?: boolean;
}) {
  return apiClient.post<CreateResumeResponse>('/user/resumes', payload);
}

export function deleteResume(resumeId: string) {
  return apiClient.delete<{
    status: 'success';
    message: string;
    data: {
      _id: string;
    };
  }>(`/user/resumes/${resumeId}`);
}
