import type { ApiEnvelope } from '@/src/features/auth/types';

type Salary = {
  min?: number;
  max?: number;
  currency?: 'VND' | 'USD';
  is_negotiable?: boolean;
};

type PublicJobDetailPayload = {
  job: {
    _id: string;
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    salary: Salary;
    location: string;
    job_type: string;
    level: string;
    category: string[];
    skills: string[];
    quantity: number;
    expired_at: string;
    published_at?: string;
    created_at?: string;
    updated_at?: string;
  };
  company: {
    _id: string;
    company_name: string;
    logo?: string;
    website?: string;
    address: string;
    description?: string;
  };
  my_application?: {
    _id: string;
    status?: string;
    applied_at?: string;
    updated_at?: string;
  } | null;
};

export type PublicJobDetailResponse = ApiEnvelope<PublicJobDetailPayload>;

export type JobDetailViewModel = {
  id: string;
  title: string;
  company: string;
  heroImage: string;
  logoImage: string;
  salary: string;
  location: string;
  experience: string;
  tags: string[];
  description: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  generalInfo: {
    label: string;
    value: string;
    icon: 'clock' | 'users' | 'briefcase' | 'calendar';
  }[];
  hasApplied: boolean;
  applicationStatus?: string;
};
