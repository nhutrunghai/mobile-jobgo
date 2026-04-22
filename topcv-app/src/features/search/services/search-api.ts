import { apiClient } from '@/src/lib/api/api-client';
import type {
  PublicSearchJobsResponse,
  SearchJobLevel,
  SearchLocation,
  SearchJobType,
} from '@/src/features/search/types';

type SearchPublicJobsParams = {
  q: string;
  location?: SearchLocation;
  job_type?: SearchJobType;
  level?: SearchJobLevel;
  page?: number;
  limit?: number;
};

export function searchPublicJobs(params: SearchPublicJobsParams) {
  return apiClient.get<PublicSearchJobsResponse>('/jobs/search', {
    q: params.q,
    location: params.location,
    job_type: params.job_type,
    level: params.level,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });
}
