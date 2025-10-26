<template>
  <aside
    class="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <!-- Sidebar Header -->
    <div
      class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div v-if="!isCollapsed" class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
        </div>
        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Kanban Board
        </h1>
      </div>
      <button
        @click="$emit('toggle-collapse')"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2">
      <!-- Projects Section -->
      <div>
        <div v-if="!isCollapsed" class="flex items-center justify-between mb-3">
          <h3
            class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Projects
          </h3>
          <button
            @click="showCreateProjectModal = true"
            class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Create New Project"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Project Dropdown -->
        <div class="relative">
          <button
            @click="projectDropdownOpen = !projectDropdownOpen"
            class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <div
              class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <div v-if="!isCollapsed" class="flex-1 text-left">
              <div class="font-medium">
                {{ currentProject?.name || "Select Project" }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ projects.length }} projects
              </div>
            </div>
            <svg
              v-if="!isCollapsed"
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <!-- Project Dropdown Menu -->
          <div
            v-if="projectDropdownOpen && !isCollapsed"
            class="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-40 max-h-64 overflow-y-auto"
          >
            <div class="p-2">
              <div
                v-if="projects.length === 0"
                class="p-3 text-sm text-gray-500 dark:text-gray-400 text-center"
              >
                No projects yet
              </div>
              <div v-else>
                <div
                  v-for="project in projects"
                  :key="project.id"
                  @click="selectProject(project)"
                  class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
                  :class="{
                    'bg-blue-50 dark:bg-blue-900/30':
                      currentProject?.id === project.id,
                  }"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-800 dark:text-gray-200">
                        {{ project.name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ project.taskCount || 0 }} tasks
                      </div>
                    </div>
                  </div>
                  <button
                    @click.stop="deleteProject(project.id)"
                    class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all"
                    title="Delete Project"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div
        v-if="!isCollapsed"
        class="pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          Quick Actions
        </h3>
        <div class="space-y-1">
          <button
            @click="$emit('quick-action', 'add-task')"
            class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>Add Task</span>
          </button>
          <button
            @click="$emit('quick-action', 'view-analytics')"
            class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Create Project Modal -->
    <div
      v-if="showCreateProjectModal"
      class="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div
        class="absolute inset-0 bg-black bg-opacity-40"
        @click="showCreateProjectModal = false"
      ></div>
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
      >
        <div class="p-6">
          <h3
            class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
          >
            Create New Project
          </h3>
          <form @submit.prevent="createProject">
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Project Name</label
              >
              <input
                v-model="newProjectName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                placeholder="Enter project name"
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Description (Optional)</label
              >
              <textarea
                v-model="newProjectDescription"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                rows="3"
                placeholder="Enter project description"
              ></textarea>
            </div>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showCreateProjectModal = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  currentProject: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  "toggle-collapse",
  "project-change",
  "project-create",
  "project-delete",
  "quick-action",
]);

// State
const projectDropdownOpen = ref(false);
const showCreateProjectModal = ref(false);
const newProjectName = ref("");
const newProjectDescription = ref("");

// Projects data
const projects = ref([
  {
    id: "1",
    name: "My First Project",
    description: "A sample project to get started",
    taskCount: 5,
    createdAt: new Date().toISOString(),
  },
]);

// Methods
function selectProject(project) {
  emit("project-change", project);
  projectDropdownOpen.value = false;
}

function createProject() {
  if (!newProjectName.value.trim()) return;

  const newProject = {
    id: Date.now().toString(),
    name: newProjectName.value.trim(),
    description: newProjectDescription.value.trim(),
    taskCount: 0,
    createdAt: new Date().toISOString(),
  };

  projects.value.unshift(newProject);
  emit("project-create", newProject);

  // Reset form
  newProjectName.value = "";
  newProjectDescription.value = "";
  showCreateProjectModal.value = false;
}

function deleteProject(projectId) {
  if (
    confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    )
  ) {
    const index = projects.value.findIndex((p) => p.id === projectId);
    if (index > -1) {
      projects.value.splice(index, 1);
      emit("project-delete", projectId);
    }
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest(".relative")) {
    projectDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
