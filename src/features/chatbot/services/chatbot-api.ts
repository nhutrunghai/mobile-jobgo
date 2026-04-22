import { apiClient } from '@/src/lib/api/api-client';
import type { ChatJobsResponse, ChatSessionDetailResponse, ChatSessionsResponse } from '@/src/features/chatbot/types';

export function sendJobChatMessage(payload: { message: string; session_id?: string; resume_id?: string }) {
  return apiClient.post<ChatJobsResponse>('/chat/jobs', payload);
}

export function getChatSessions() {
  return apiClient.get<ChatSessionsResponse>('/chat/sessions');
}

export function getChatSession(sessionId: string) {
  return apiClient.get<ChatSessionDetailResponse>(`/chat/sessions/${sessionId}`);
}

export function deleteChatSession(sessionId: string) {
  return apiClient.delete<{ status: 'success'; message: string }>(`/chat/sessions/${sessionId}`);
}
