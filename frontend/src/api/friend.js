import { apiRequest } from './apiService';

export const sendFriendRequest = async (friendNickname) => {
  return await apiRequest(`/api/v1/friends/request/${friendNickname}`, 'POST');
};

export const acceptFriendRequest = async (senderNickname) => {
  return await apiRequest(`/api/v1/friends/accept/${senderNickname}`, 'POST');
};

export const getFriendRequests = async () => {
  return await apiRequest('/api/v1/friends/request', 'GET');
};

export const getFriendsList = async () => {
  return await apiRequest('/api/v1/friends/list', 'GET');
};

export const deleteFriend = async (friendNickname) => {
  return await apiRequest(`/api/v1/friends/${friendNickname}`, 'DELETE');
};