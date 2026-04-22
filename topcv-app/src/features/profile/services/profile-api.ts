import { apiClient } from '@/src/lib/api/api-client';
import type {
  ProfileMeResponse,
  ProfilePublicResponse,
  ProfileSettingResponse,
} from '@/src/features/profile/types';

export function getProfileMe() {
  return apiClient.get<ProfileMeResponse>('/user/me');
}

export function getProfileByUsername(username: string) {
  return apiClient.get<ProfilePublicResponse>(`/user/profile/${username}`);
}

export function updateProfile(body: {
  fullName?: string;
  bio?: string;
  address?: string;
  skills?: string[];
}) {
  return apiClient.patch<{ status: 'success'; message: string }>('/user/profile', body);
}

export function updateProfileAvatar(body: { avatar: string; avatar_file_key: string }) {
  return apiClient.patch<{ status: 'success'; message: string }>('/user/profile/avatar', body);
}

export function getProfileSetting() {
  return apiClient.get<ProfileSettingResponse>('/user/setting');
}

export function updateProfileSetting(body: { phone?: string }) {
  return apiClient.patch<{ status: 'success'; message: string }>('/user/setting', body);
}

export function requestVerificationEmail() {
  return apiClient.post<{ status: 'success'; message: string }>('/user/setting/resend-mail');
}

export function requestChangePasswordOtp() {
  return apiClient.post<{ status: 'success'; message: string }>('/user/setting/change-password');
}

export function submitNewPassword(body: {
  newPassword: string;
  confirmNewPassword: string;
  OtpCode: string;
}) {
  return apiClient.post<{ status: 'success'; message: string }>('/user/setting/new-password', body);
}
