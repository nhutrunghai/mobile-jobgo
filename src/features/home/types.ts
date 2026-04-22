import type { ApiEnvelope } from '@/src/features/auth/types';

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

export type PublicHomeJobItem = {
  _id: string;
  title: string;
  location: string;
  salary: Salary;
  company: Company;
  promotion?: {
    _id: string;
    type: string;
    priority: number;
    starts_at: string;
    ends_at: string;
  };
};

export type PublicHomeJobListResponse = ApiEnvelope<{
  items: PublicHomeJobItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next?: boolean;
  };
}>;

export type HomeJobCardItem = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  image: string;
  favorite?: boolean;
  highlighted?: boolean;
  badge?: 'bolt';
};

export type HomeArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type HomeArticleItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  highlight: string;
  sections: HomeArticleSection[];
};
