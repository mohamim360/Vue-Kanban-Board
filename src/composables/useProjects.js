import { ref, reactive } from 'vue';
import { projectsAPI } from '../api/projects';
import { tasksAPI } from '../api/tasks';

export function useProjects() {
  const projects = ref([]);
  const currentProject = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Load all projects for user
  const loadProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectsAPI.getAll();
      projects.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load projects';
      console.error('Error loading projects:', err);
    } finally {
      loading.value = false;
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectsAPI.create(projectData);
      projects.value.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create project';
      console.error('Error creating project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Switch current project
  const switchProject = async (projectId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectsAPI.getById(projectId);
      currentProject.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load project';
      console.error('Error switching project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    loading.value = true;
    error.value = null;
    try {
      await projectsAPI.delete(projectId);
      projects.value = projects.value.filter(p => p.id !== projectId);
      if (currentProject.value?.id === projectId) {
        currentProject.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete project';
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update current project
  const updateCurrentProject = async (updateData) => {
    if (!currentProject.value) return;
    
    loading.value = true;
    error.value = null;
    try {
      const response = await projectsAPI.update(currentProject.value.id, updateData);
      currentProject.value = response.data;
      
      // Update in projects list
      const index = projects.value.findIndex(p => p.id === currentProject.value.id);
      if (index !== -1) {
        projects.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update project';
      console.error('Error updating project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update project task count
  const updateProjectTaskCount = (projectId) => {
    // This would typically involve recalculating or fetching fresh data
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      // You might want to refetch the project to get accurate counts
      loadProjects();
    }
  };

  return {
    projects,
    currentProject,
    loading,
    error,
    loadProjects,
    createProject,
    switchProject,
    deleteProject,
    updateCurrentProject,
    updateProjectTaskCount,
  };
}