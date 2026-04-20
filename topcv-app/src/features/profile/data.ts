import { Feather } from '@expo/vector-icons';

import { homeHeader } from '@/src/features/home/data';

type ToggleItem = {
  key: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  enabled: boolean;
};

type CvActionItem = {
  key: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
};

type ManagementItem = {
  key: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
};

type SettingsItem = {
  key: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  destructive?: boolean;
};

type SupportItem = {
  key: string;
  title: string;
};

export const profileHeader = {
  name: 'Nhữ Trung Hải',
  candidateId: '7279422',
  avatar: homeHeader.profileImage,
} as const;

export const profileToggles: readonly ToggleItem[] = [
  {
    key: 'job-search-status',
    title: 'Trạng thái tìm việc',
    icon: 'briefcase',
    enabled: true,
  },
  {
    key: 'allow-contact',
    title: 'Cho phép NTD liên hệ',
    icon: 'user-check',
    enabled: false,
  },
];

export const cvActions: readonly CvActionItem[] = [
  {
    key: 'created-cv',
    title: 'CV đã tạo',
    icon: 'file-text',
  },
  {
    key: 'uploaded-cv',
    title: 'CV đã tải lên',
    icon: 'upload',
  },
  {
    key: 'cover-letter',
    title: 'Thư xin việc',
    icon: 'mail',
  },
];

export const jobManagementItems: readonly ManagementItem[] = [
  {
    key: 'applied-jobs',
    title: 'Việc làm đã ứng tuyển',
    icon: 'send',
  },
  {
    key: 'saved-jobs',
    title: 'Việc làm đã lưu',
    icon: 'bookmark',
  },
  {
    key: 'matched-jobs',
    title: 'Việc làm phù hợp',
    icon: 'star',
  },
  {
    key: 'followed-companies',
    title: 'Công ty đang theo dõi',
    icon: 'briefcase',
  },
  {
    key: 'viewed-profile',
    title: 'NTD đã xem hồ sơ',
    icon: 'eye',
  },
  {
    key: 'job-suggestions',
    title: 'Gợi ý việc làm',
    icon: 'settings',
  },
];

export const accountSettings: readonly SettingsItem[] = [
  { key: 'vip', title: 'Nâng cấp tài khoản VIP', icon: 'award' },
  { key: 'password', title: 'Đổi mật khẩu', icon: 'key' },
  { key: 'security', title: 'Cài đặt bảo mật', icon: 'shield' },
  { key: '2fa', title: 'Xác minh 2 bước', icon: 'check-circle' },
  { key: 'email-notification', title: 'Cài đặt thông báo email', icon: 'bell' },
  {
    key: 'disable-account',
    title: 'Vô hiệu hóa tài khoản',
    icon: 'slash',
    destructive: true,
  },
];

export const supportItems: readonly SupportItem[] = [
  { key: 'about-topcv', title: 'Về TopCV' },
  { key: 'terms', title: 'Điều khoản dịch vụ' },
  { key: 'privacy', title: 'Chính sách bảo mật' },
  { key: 'pricing', title: 'Giá dịch vụ & Cách thanh toán' },
  { key: 'support-center', title: 'Trung tâm trợ giúp' },
  { key: 'rate-app', title: 'Đánh giá ứng dụng' },
];

export const appVersion = 'Phiên bản ứng dụng: 5.6.58';
