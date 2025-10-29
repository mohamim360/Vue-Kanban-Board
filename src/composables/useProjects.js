// src/composables/useProjects.js
import { ref } from 'vue';

const PROJECTS_KEY = 'kanban-projects';
const CURRENT_PROJECT_KEY = 'kanban-current-project';

export function useProjects() {
  const projects = ref([]);
  const currentProject = ref(null);

  const loadProjects = () => {
    try {
      const saved = localStorage.getItem(PROJECTS_KEY);
      if (saved) {
        const loadedProjects = JSON.parse(saved);
        projects.value = loadedProjects;
        
        // Load last active project
        const currentId = localStorage.getItem(CURRENT_PROJECT_KEY);
        if (currentId) {
          currentProject.value = loadedProjects.find(p => p.id === currentId) || loadedProjects[0];
        } else {
          currentProject.value = loadedProjects[0];
        }
      } else {
        // Create default project
        const defaultProject = createDefaultProject();
        projects.value = [defaultProject];
        currentProject.value = defaultProject;
        saveProjects([defaultProject]);
      }
    } catch (e) {
      console.error('Failed to load projects', e);
    }
  };

  const createDefaultProject = () => ({
    id: 'default-' + Math.random().toString(36).slice(2, 10),
    name: 'My First Project',
    description: 'Welcome to your Kanban board!',
    createdAt: new Date().toISOString(),
    taskCount: 0,
    columns: {
      todo: { name: 'To Do', cards: [] },
      inprogress: { name: 'In Progress', cards: [] },
      done: { name: 'Done', cards: [] }
    }
  });

  const saveProjects = (updatedProjects) => {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
      projects.value = updatedProjects;
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  };

  const createProject = (projectData) => {
    const newProject = {
      id: Math.random().toString(36).slice(2, 10),
      name: projectData.name,
      description: projectData.description || '',
      createdAt: new Date().toISOString(),
      taskCount: 0,
      columns: {
        todo: { name: 'To Do', cards: [] },
        inprogress: { name: 'In Progress', cards: [] },
        done: { name: 'Done', cards: [] }
      }
    };
    const updated = [newProject, ...projects.value];
    saveProjects(updated);
    currentProject.value = newProject;
    localStorage.setItem(CURRENT_PROJECT_KEY, newProject.id);
    return newProject;
  };

  const switchProject = (projectId) => {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      currentProject.value = project;
      localStorage.setItem(CURRENT_PROJECT_KEY, projectId);
      return project;
    }
    return null;
  };

  const deleteProject = (projectId) => {
    const filtered = projects.value.filter(p => p.id !== projectId);
    saveProjects(filtered);
    
    if (currentProject.value?.id === projectId) {
      currentProject.value = filtered.length > 0 ? filtered[0] : null;
      if (currentProject.value) {
        localStorage.setItem(CURRENT_PROJECT_KEY, currentProject.value.id);
      } else {
        localStorage.removeItem(CURRENT_PROJECT_KEY);
      }
    }
    return true;
  };

  const updateCurrentProject = (updatedData) => {
    if (!currentProject.value) return;
    
    const updated = projects.value.map(p =>
      p.id === currentProject.value.id ? { ...p, ...updatedData } : p
    );
    saveProjects(updated);
    currentProject.value = { ...currentProject.value, ...updatedData };
  };

  const updateProjectTaskCount = (projectId) => {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      const count = 
        (project.columns?.todo?.cards?.length || 0) +
        (project.columns?.inprogress?.cards?.length || 0) +
        (project.columns?.done?.cards?.length || 0);
      
      project.taskCount = count;
      updateCurrentProject({ taskCount: count });
    }
  };

  return {
    projects,
    currentProject,
    loadProjects,
    createProject,
    switchProject,
    deleteProject,
    updateCurrentProject,
    updateProjectTaskCount
  };
}