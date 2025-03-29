import { apiRequest } from './apiService';

export const updateUser = async (userData) => {
  return await apiRequest('/api/v1/users/update', 'PUT', userData);
};

export const getCurrentUser = async () => {
  return await apiRequest('/api/v1/users/me', 'GET');
};

export const deleteUser = async () => {
  return await apiRequest('/api/v1/users/delete', 'DELETE');
};