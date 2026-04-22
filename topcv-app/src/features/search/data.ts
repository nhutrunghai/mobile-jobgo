import type {
  SearchJobLevel,
  SearchJobType,
  SearchLocation,
  SearchOption,
} from '@/src/features/search/types';

export const popularKeywords = [
  'tiếng hàn',
  'lập trình viên php',
  'tiếng trung',
  'trợ lý giám đốc',
  'giáo viên tiếng anh',
] as const;

export const locationOptions: SearchOption<SearchLocation>[] = [
  { label: 'Toàn quốc' },
  { label: 'Hà Nội', value: 'Ha Noi' },
  { label: 'Hồ Chí Minh', value: 'Ho Chi Minh' },
  { label: 'Hải Phòng', value: 'Hai Phong' },
  { label: 'Đà Nẵng', value: 'Da Nang' },
];

export const jobTypeOptions: SearchOption<SearchJobType>[] = [
  { label: 'Tất cả' },
  { label: 'Toàn thời gian', value: 'full-time' },
  { label: 'Bán thời gian', value: 'part-time' },
  { label: 'Thực tập', value: 'internship' },
  { label: 'Hợp đồng', value: 'contract' },
  { label: 'Từ xa', value: 'remote' },
];

export const jobLevelOptions: SearchOption<SearchJobLevel>[] = [
  { label: 'Tất cả' },
  { label: 'Intern', value: 'intern' },
  { label: 'Fresher', value: 'fresher' },
  { label: 'Junior', value: 'junior' },
  { label: 'Middle', value: 'middle' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead', value: 'lead' },
  { label: 'Manager', value: 'manager' },
];
