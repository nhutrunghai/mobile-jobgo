import type { ApiEnvelope } from '@/src/features/auth/types';

export type ResumeItem = {
  _id: string;
  title: string;
  cv_url: string;
  is_default?: boolean;
  updated_at?: string;
};

export type ResumeListResponse = ApiEnvelope<ResumeItem[]>;

export type ApplyJobResponse = ApiEnvelope<{
  _id: string;
  job_id: string;
  company_id: string;
  candidate_id: string;
  status?: string;
  applied_at?: string;
  updated_at?: string;
}>;

export type CreateResumeResponse = ApiEnvelope<ResumeItem & {
  resume_file_key?: string;
  resume_indexing?: {
    status: string;
    chunks_indexed: number;
  };
}>;
