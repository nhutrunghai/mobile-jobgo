import type { ApiEnvelope } from '@/src/features/auth/types';

type Salary = {
  min?: number;
  max?: number;
  currency?: 'VND' | 'USD';
  is_negotiable?: boolean;
};

type AppliedJobStatus =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'interviewing'
  | 'rejected'
  | 'hired'
  | 'withdrawn';

type AppliedJobItem = {
  _id: string;
  status?: AppliedJobStatus;
  applied_at?: string;
  updated_at?: string;
  job: {
    _id: string;
    title: string;
    location: string;
    salary: Salary;
    expired_at: string;
    status?: string;
  };
  company: {
    _id: string;
    company_name: string;
    logo?: string;
  };
};

export type AppliedJobsResponse = ApiEnvelope<{
  applications: AppliedJobItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}>;

export type AppliedJobCardViewModel = {
  id: string;
  applicationId: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  salary: string;
  statusLabel: string;
  statusTone: 'green' | 'amber' | 'blue' | 'red' | 'slate';
  appliedAtLabel: string;
};
