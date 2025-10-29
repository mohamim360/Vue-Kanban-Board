<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <Sidebar
      :is-collapsed="sidebarCollapsed"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
      :current-project="currentProject"
      :projects="projects"
      @project-change="handleProjectChange"
      @project-create="handleProjectCreate"
      @project-delete="handleProjectDelete"
    />

    <!-- Main Content Area -->
    <div
      class="transition-all duration-300"
      :class="sidebarCollapsed ? 'ml-16' : 'ml-64'"
    >
      <!-- Navbar -->
      <Navbar :user="user" @sign-out="handleSignOut" />

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import { useUser, useClerk } from "@clerk/vue";

const { user } = useUser();
const sidebarCollapsed = ref(false);
const currentProject = ref(null);
const clerk = useClerk();

// Project management functions
function handleProjectChange(project) {
  currentProject.value = project;
  // Emit event to parent component to load project data
  emit("project-change", project);
}

function handleProjectCreate(projectData) {
  // Emit event to parent component to create new project
  emit("project-create", projectData);
}

function handleProjectDelete(projectId) {
  // Emit event to parent component to delete project
  emit("project-delete", projectId);
}

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

async function handleSignOut() {
  try {
    await clerk.value.signOut();
    window.location.href = "/"; 
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

const emit = defineEmits([
  "project-change",
  "project-create",
  "project-delete",
]);
</script>
