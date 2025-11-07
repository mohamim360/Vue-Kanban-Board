<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <Sidebar
        :current-project="currentProject"
        :projects="projects"
        @project-change="handleProjectChange"
        @project-create="handleProjectCreate"
        @project-delete="handleProjectDelete"
        @close-mobile="sidebarOpen = false"
      />
    </div>

    <!-- Main Content Area -->
    <div class="lg:ml-64 min-h-screen flex flex-col">
      <!-- Navbar -->
      <Navbar 
        :user="user" 
        :current-project="currentProject"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @sign-out="handleSignOut" 
      />

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6">
        <!-- Show empty state when no project is selected -->
        <div v-if="!currentProject" class="flex items-center justify-center h-96">
          <div class="text-center px-4">
            <div class="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 text-gray-300 dark:text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-lg lg:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Project Selected
            </h3>
            <p class="text-sm lg:text-base text-gray-500 dark:text-gray-400 mb-4 lg:mb-6 max-w-md">
              Choose a project from the sidebar or create a new one to get started with your kanban board.
            </p>
            <button
              @click="handleCreateFirstProject"
              class="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto text-sm lg:text-base"
            >
              <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Your First Project
            </button>
          </div>
        </div>

        <!-- Show actual content when project is selected -->
        <div v-else class="h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import { useUser, useClerk } from "@clerk/vue";

const { user } = useUser();
const currentProject = ref(null);
const sidebarOpen = ref(false);
const clerk = useClerk();

const props = defineProps({
  currentProject: {
    type: Object,
    default: null,
  },
  projects: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "project-change",
  "project-create",
  "project-delete",
]);

// Watch for prop changes
watch(() => props.currentProject, (newProject) => {
  currentProject.value = newProject;
}, { immediate: true });

// Project management functions
function handleProjectChange(project) {
  currentProject.value = project;
  sidebarOpen.value = false; // Close sidebar on mobile when project changes
  emit("project-change", project);
}

function handleProjectCreate(projectData) {
  emit("project-create", projectData);
}

function handleProjectDelete(projectId) {
  emit("project-delete", projectId);
  // If we're deleting the current project, clear it
  if (currentProject.value?.id === projectId) {
    currentProject.value = null;
  }
}

function handleCreateFirstProject() {
  // Trigger project creation from sidebar
  const sidebarCreateButton = document.querySelector('[title="Create New Project"]');
  if (sidebarCreateButton) {
    sidebarCreateButton.click();
  }
}

async function handleSignOut() {
  try {
    await clerk.value.signOut();
    window.location.href = "/"; 
  } catch (error) {
    console.error("Error signing out:", error);
  }
}
</script>