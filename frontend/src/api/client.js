import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
});

export const uploadFiles = (files, isBulk = false) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const endpoint = isBulk ? '/upload/bulk' : '/upload/single';
  return apiClient.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getDocuments = () => {
  return apiClient.get('/upload');
};

export const deleteDocument = (id) => {
  return apiClient.delete(`/upload/${id}`);
};

export const downloadDocument = (filename) => {
  return `${API_URL}/api/upload/download/${filename}`;
};

export const getNotifications = () => {
  return apiClient.get('/notifications');
};

export const markNotificationAsRead = (id) => {
  return apiClient.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
  return apiClient.patch('/notifications/read/all');
};

export const getUnreadCount = () => {
  return apiClient.get('/notifications/unread/count');
};
