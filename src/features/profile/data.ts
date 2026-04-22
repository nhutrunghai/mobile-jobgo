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
];

export const cvActions: readonly CvActionItem[] = [
  {
    key: 'uploaded-cv',
    title: 'CV đã tải lên',
    icon: 'file-text',
  },
  {
    key: 'upload-cv',
    title: 'Tải CV lên',
    icon: 'upload',
  },
];

export const jobManagementItems: readonly ManagementItem[] = [
  {
    key: 'profile-detail',
    title: 'Hồ sơ',
    icon: 'user',
  },
  {
    key: 'saved-jobs',
    title: 'Việc làm đã lưu',
    icon: 'bookmark',
  },
  {
    key: 'settings-hub',
    title: 'Cài đặt',
    icon: 'settings',
  },
];

export const accountSettings: readonly SettingsItem[] = [
  { key: 'vip', title: 'Nâng cấp tài khoản VIP', icon: 'award' },
  { key: 'password', title: 'Đổi mật khẩu', icon: 'key' },
  { key: 'security', title: 'Cài đặt bảo mật', icon: 'shield' },
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
