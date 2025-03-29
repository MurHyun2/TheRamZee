import { apiRequest } from './apiService';

export const login = async (username, password) => {
  return await apiRequest('/api/v1/auth/login', 'POST', { username, password }, false);
};

export const register = async (userData) => {
  return await apiRequest('/api/v1/auth/register', 'POST', userData);
};

export const refreshToken = async () => {
  return await apiRequest('/api/v1/auth/refresh-token', 'POST');
};

export const logout = async () => {
  return await apiRequest('/api/v1/auth/logout', 'POST');
};
export const relog = async () => {
  return await apiRequest('/api/v1/auth/relog', 'POST');
};