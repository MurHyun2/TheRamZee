import { apiRequest } from './apiService';

export const fetchRooms = async () => {
  return await apiRequest('/api/v1/rooms', 'GET');
};

export const createRoom = async (rommTitle, password) => {
  return await apiRequest('/api/v1/rooms', 'POST', {title: rommTitle, password: password});
};

export const leaveRoom = async (roomId) => {
  return await apiRequest(`/api/v1/rooms/${roomId}/leave`, 'POST');
};

export const joinRoom = async (roomId, password="") => {
  return await apiRequest(`/api/v1/rooms/${roomId}/join`, 'POST', {password: password});
};

export const fetchRoomById = async (roomId) => {
  return await apiRequest(`/api/v1/rooms/${roomId}`, 'GET');
};

export const followFriend = async (friendNickname) => {
  return await apiRequest('/api/v1/rooms/follow', 'POST', { friendNickname });
};