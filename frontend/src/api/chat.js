import { apiRequest } from './apiService';

// 메시지 읽음 처리
export const markAsRead = async (sender, receiver) => {
  return await apiRequest('/api/v1/chat/mark-as-read', 'PUT', { sender, receiver });
};

// 읽지 않은 메시지 수 조회
export const getUnreadCount = async (receiver) => {
  return await apiRequest(`/api/v1/chat/unread-count?receiver=${receiver}`, 'GET');
};

// 채팅 기록 조회
export const getChatHistory = async (sender, receiver) => {
  return await apiRequest(`/api/v1/chat/history?sender=${sender}&receiver=${receiver}`, 'GET');
};