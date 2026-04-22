import type { ApiEnvelope } from '@/src/features/auth/types';

export type SearchJobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'remote';
export type SearchJobLevel =
  | 'intern'
  | 'fresher'
  | 'junior'
  | 'middle'
  | 'senior'
  | 'lead'
  | 'manager';
export type SearchLocation = 'Ha Noi' | 'Ho Chi Minh' | 'Hai Phong' | 'Da Nang';

type Salary = {
  min?: number;
  max?: number;
  currency?: 'VND' | 'USD';
  is_negotiable?: boolean;
};

type Company = {
  _id: string;
  company_name: string;
  logo?: string;
};

export type PublicSearchJobItem = {
  _id: string;
  title: string;
  location: string;
  job_type: SearchJobType;
  level: SearchJobLevel;
  salary: Salary;
  skills: string[];
  published_at: string;
  expired_at: string;
  company: Company;
};

export type PublicSearchJobsResponse = ApiEnvelope<{
  items: PublicSearchJobItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}>;

export type SearchJobCardItem = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  image: string;
  highlighted?: boolean;
  favorite?: boolean;
};

export type SearchOption<TValue extends string> = {
  label: string;
  value?: TValue;
};
