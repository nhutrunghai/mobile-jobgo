import { apiClient } from '@/src/lib/api/api-client';
import { getRefreshToken } from '@/src/lib/auth/token-store';
import type { ApiEnvelope, AuthSuccessData } from '@/src/features/auth/types';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  password: string;
  confirmPassword: string;
  forgot_password_token: string;
};

export async function loginWithEmail(payload: LoginPayload) {
  return apiClient.post<ApiEnvelope<AuthSuccessData>>('/auth/login', payload);
}

export async function registerWithEmail(payload: RegisterPayload) {
  return apiClient.post<ApiEnvelope<AuthSuccessData>>('/auth/register', payload);
}

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  return apiClient.post<ApiEnvelope<null>>('/auth/forgot-password', payload);
}

export async function resetPasswordWithToken(payload: ResetPasswordPayload) {
  return apiClient.post<ApiEnvelope<null>>('/auth/reset-password', payload);
}

export async function logoutCurrentUser() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  return apiClient.post<ApiEnvelope<null>>('/auth/logout', {
    refresh_token: refreshToken,
  }, {
    skipAuthRefresh: true,
  });
}
