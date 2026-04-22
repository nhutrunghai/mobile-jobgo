import { homeHeader } from '@/src/features/home/data';
import type { HomeJobCardItem, PublicHomeJobItem } from '@/src/features/home/types';

function resolveCompanyLogo(logo?: string) {
  if (!logo) {
    return homeHeader.profileImage;
  }

  const trimmedLogo = logo.trim();

  if (!trimmedLogo) {
    return homeHeader.profileImage;
  }

  try {
    const parsedUrl = new URL(trimmedLogo);

    if (parsedUrl.hostname === 'example.com' || parsedUrl.hostname.endsWith('.example.com')) {
      return homeHeader.profileImage;
    }

    return trimmedLogo;
  } catch {
    return homeHeader.profileImage;
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

function formatSalary(item: PublicHomeJobItem) {
  const salary = item.salary ?? {};

  if (salary.is_negotiable) {
    return 'Thỏa thuận';
  }

  if (salary.min && salary.max) {
    return `${formatCompactMoney(salary.min)} - ${formatCompactMoney(salary.max)}`;
  }

  if (salary.min) {
    return `Từ ${formatCompactMoney(salary.min)}`;
  }

  if (salary.max) {
    return `Đến ${formatCompactMoney(salary.max)}`;
  }

  return 'Thỏa thuận';
}

export function mapHomeJobToCard(item: PublicHomeJobItem): HomeJobCardItem {
  return {
    id: item._id,
    title: item.title,
    company: item.company.company_name,
    salary: formatSalary(item),
    location: item.location,
    image: resolveCompanyLogo(item.company.logo),
    highlighted: Boolean(item.promotion),
    badge: item.promotion ? 'bolt' : undefined,
  };
}
