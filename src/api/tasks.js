import apiClient from './client';

export const tasksAPI = {
  // Get tasks for a project
  getByProject: (projectId) => apiClient.get(`/tasks/project/${projectId}`),
  
  // Create new task - ensure proper data formatting
  create: (data) => {
    // Ensure priority is uppercase and dates are properly formatted
    const formattedData = {
      ...data,
      priority: data.priority?.toUpperCase() || 'MEDIUM',
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      // assignedUserId remains as Clerk user ID - backend will handle mapping
    };
    return apiClient.post('/tasks', formattedData);
  },
  
  // Update task
  update: (id, data) => {
    const formattedData = {
      ...data,
      priority: data.priority?.toUpperCase() || 'MEDIUM',
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    return apiClient.put(`/tasks/${id}`, formattedData);
  },
  
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