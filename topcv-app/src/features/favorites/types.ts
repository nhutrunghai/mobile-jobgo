import type { ApiEnvelope } from '@/src/features/auth/types';
import type { PublicHomeJobItem } from '@/src/features/home/types';

export type FavoriteJobsResponse = ApiEnvelope<{
  jobs: {
    job_id: string;
    favorited_at: string;
    job: PublicHomeJobItem;
    company: {
      _id: string;
      company_name: string;
      logo?: string;
    };
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}>;
