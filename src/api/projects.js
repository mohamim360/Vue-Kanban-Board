import apiClient from './client';

export const projectsAPI = {
  // Get all projects for current user
  getAll: () => apiClient.get('/projects'),
  
  // Get single project by ID
  getById: (id) => apiClient.get(`/projects/${id}`),
  
  // Create new project
  create: (data) => apiClient.post('/projects', data),
  
  // Update project
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  
  // Delete project
  delete: (id) => apiClient.delete(`/projects/${id}`),
};