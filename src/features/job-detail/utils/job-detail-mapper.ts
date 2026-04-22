import { detailJob } from '@/src/features/job-detail/data';
import type { JobDetailViewModel, PublicJobDetailResponse } from '@/src/features/job-detail/types';

function resolveImage(url?: string) {
  if (!url) {
    return detailJob.logoImage;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return detailJob.logoImage;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.hostname === 'example.com' || parsedUrl.hostname.endsWith('.example.com')) {
      return detailJob.logoImage;
    }

    return trimmedUrl;
  } catch {
    return detailJob.logoImage;
  }
}

function formatCompactMoney(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return Number.isInteger(millions) ? `${millions} triệu` : `${millions.toFixed(1)} triệu`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} nghìn`;
  }

  return `${value}`;
}

function formatSalary(salary: PublicJobDetailResponse['data']['job']['salary']) {
  if (salary?.is_negotiable) {
    return 'Thỏa thuận';
  }

  if (salary?.min && salary?.max) {
    return `${formatCompactMoney(salary.min)} - ${formatCompactMoney(salary.max)}`;
  }

  if (salary?.min) {
    return `Từ ${formatCompactMoney(salary.min)}`;
  }

  if (salary?.max) {
    return `Đến ${formatCompactMoney(salary.max)}`;
  }

  return 'Thỏa thuận';
}

function mapJobLevel(level: string) {
  switch (level) {
    case 'intern':
      return 'Thực tập';
    case 'fresher':
      return 'Fresher';
    case 'junior':
      return 'Junior';
    case 'middle':
      return 'Middle';
    case 'senior':
      return 'Senior';
    case 'lead':
      return 'Lead';
    case 'manager':
      return 'Manager';
    default:
      return level;
  }
}

function mapJobType(jobType: string) {
  switch (jobType) {
    case 'full-time':
      return 'Toàn thời gian';
    case 'part-time':
      return 'Bán thời gian';
    case 'internship':
      return 'Thực tập';
    case 'contract':
      return 'Hợp đồng';
    case 'remote':
      return 'Từ xa';
    default:
      return jobType;
  }
}

function formatDate(dateString?: string) {
  if (!dateString) {
    return 'Đang cập nhật';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Đang cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN').format(date);
}

function splitTextBlock(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function mapJobDetailResponseToViewModel(response: PublicJobDetailResponse): JobDetailViewModel {
  const payload = response.data;
  const logoImage = resolveImage(payload.company.logo);
  const description = splitTextBlock(payload.job.description);
  const requirements = splitTextBlock(payload.job.requirements);
  const benefits = splitTextBlock(payload.job.benefits);
  const applicationStatus = payload.my_application?.status?.toLowerCase();
  const hasApplied = Boolean(payload.my_application && applicationStatus !== 'withdrawn');

  return {
    id: payload.job._id,
    title: payload.job.title,
    company: payload.company.company_name,
    heroImage: detailJob.heroImage,
    logoImage,
    salary: formatSalary(payload.job.salary),
    location: payload.job.location,
    experience: mapJobLevel(payload.job.level),
    tags: [...payload.job.category, ...payload.job.skills].slice(0, 6),
    description,
    requirements,
    benefits,
    skills: payload.job.skills,
    generalInfo: [
      { label: 'Hạn ứng tuyển', value: formatDate(payload.job.expired_at), icon: 'clock' },
      { label: 'Số lượng tuyển', value: `${payload.job.quantity} người`, icon: 'users' },
      { label: 'Cấp bậc', value: mapJobLevel(payload.job.level), icon: 'briefcase' },
      { label: 'Hình thức làm việc', value: mapJobType(payload.job.job_type), icon: 'calendar' },
    ],
    hasApplied,
    applicationStatus,
  };
}
