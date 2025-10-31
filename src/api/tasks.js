import apiClient from './client';

export const tasksAPI = {
  // Get tasks for a project
  getByProject: (projectId) => apiClient.get(`/tasks/project/${projectId}`),
  
  // Create new task
  create: (data) => apiClient.post('/tasks', data),
  
  // Update task
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  
  // Move task to different status
  move: (id, status) => apiClient.put(`/tasks/${id}/move`, { status }),
  
  // Delete task
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  
  // Clone task
  clone: (id) => apiClient.post(`/tasks/${id}/clone`),
  
  // Search tasks
  search: (projectId, query) => apiClient.get(`/tasks/search?projectId=${projectId}&q=${query}`),
  
  // Filter tasks
  filter: (projectId, filters) => apiClient.get(`/tasks/filter?projectId=${projectId}`, { params: filters }),
};