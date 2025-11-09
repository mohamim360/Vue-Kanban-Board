<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Sidebar -->
    <Sidebar
      ref="sidebarRef"
      :current-project="currentProject"
      :projects="projects"
      @project-change="handleProjectChange"
      @project-create="handleProjectCreate"
      @project-delete="handleProjectDelete"
      @quick-action="handleQuickAction"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
      <!-- Navbar -->
      <Navbar 
        :user="user" 
        :current-project="currentProject"
        @toggle-sidebar="toggleSidebar"
        @sign-out="handleSignOut" 
      />

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <!-- Show empty state when no project is selected -->
        <div v-if="!currentProject" class="flex items-center justify-center h-full min-h-[400px]">
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
              class="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-sm lg:text-base"
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
const clerk = useClerk();
const currentProject = ref(null);
const sidebarRef = ref(null);

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
  "quick-action",
]);

// Watch for prop changes
watch(() => props.currentProject, (newProject) => {
  currentProject.value = newProject;
}, { immediate: true });

// Methods
function toggleSidebar() {
  if (sidebarRef.value) {
    sidebarRef.value.openSidebar();
  }
}

function handleProjectChange(project) {
  currentProject.value = project;
  emit("project-change", project);
}

function handleProjectCreate(projectData) {
  emit("project-create", projectData);
}

function handleProjectDelete(projectId) {
  emit("project-delete", projectId);
  if (currentProject.value?.id === projectId) {
    currentProject.value = null;
  }
}

function handleQuickAction(action) {
  emit("quick-action", action);
}

function handleCreateFirstProject() {
  if (sidebarRef.value) {
    sidebarRef.value.openSidebar();
  }
  // Trigger the create project modal
  setTimeout(() => {
    const createButton = document.querySelector('[title="Create New Project"]');
    if (createButton) {
      createButton.click();
    }
  }, 300);
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