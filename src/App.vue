<template>
  <AuthWrapper>
    <Layout
      :current-project="currentProject"
      :projects="projects"
      @project-change="handleProjectChange"
      @project-create="handleProjectCreate"
      @project-delete="handleProjectDelete"
    >
      <div class="text-gray-800 dark:text-gray-100">
        <!-- Board Title -->
        <div class="mb-6">
          <input
            type="text"
            :value="boardTitle"
            @input="updateBoardTitle($event.target.value)"
            class="text-2xl font-bold bg-transparent border-b-2 border-indigo-300 hover:border-indigo-600 focus:outline-none px-2 py-1 rounded transition-colors"
            placeholder="Enter board title..."
          />
        </div>

        <!-- Add Task Button -->
        <div class="mb-6">
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add Task
          </button>
        </div>

        <!-- Search, Filter and Sort Controls -->
        <div class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
              <label for="search" class="block text-sm font-medium mb-1"
                >Search</label
              >
              <div class="relative">
                <input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search tasks..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Filter by User -->
            <div>
              <label for="userFilter" class="block text-sm font-medium mb-1"
                >Assigned To</label
              >
              <select
                id="userFilter"
                v-model="userFilter"
                class="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Users</option>
                <option
                  v-for="user in demoUsers"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>

            <!-- Filter by Tag -->
            <div>
              <label for="tagFilter" class="block text-sm font-medium mb-1"
                >Tag</label
              >
              <select
                id="tagFilter"
                v-model="tagFilter"
                class="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Tags</option>
                <option v-for="tag in allTags" :key="tag" :value="tag">
                  {{ tag }}
                </option>
              </select>
            </div>

            <!-- Sort By -->
            <div>
              <label for="sortBy" class="block text-sm font-medium mb-1"
                >Sort By</label
              >
              <select
                id="sortBy"
                v-model="sortBy"
                class="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="createdAt">Creation Date</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Kanban Columns -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="column in columnsOrder"
            :key="column"
            class="flex flex-col"
          >
            <div
              class="flex items-center justify-between mb-4 p-3 rounded-t-lg transition-colors sticky top-0 z-20"
              :class="{
                'bg-blue-100 dark:bg-blue-900': column === 'todo',
                'bg-yellow-100 dark:bg-yellow-900': column === 'inprogress',
                'bg-green-100 dark:bg-green-900': column === 'done',
              }"
            >
              <div class="flex items-center gap-2">
                <h2
                  class="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"
                >
                  <span
                    v-if="column === 'todo'"
                    class="w-3 h-3 rounded-full bg-blue-500"
                  ></span>
                  <span
                    v-if="column === 'inprogress'"
                    class="w-3 h-3 rounded-full bg-yellow-500"
                  ></span>
                  <span
                    v-if="column === 'done'"
                    class="w-3 h-3 rounded-full bg-green-500"
                  ></span>
                  {{ columns[column].name }}
                </h2>
                <span
                  class="text-sm font-medium px-2 py-1 rounded-full bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 text-gray-800 dark:text-gray-200"
                >
                  {{ filteredAndSortedCards(column).length }}
                </span>
              </div>

              <!-- Column Actions Dropdown -->
              <div class="relative">
                <button
                  @click="toggleColumnDropdown(column)"
                  class="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"
                    />
                  </svg>
                </button>

                <div
                  v-if="columnDropdownOpen === column"
                  class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20"
                >
                  <button
                    @click="confirmDeleteAll(column)"
                    class="w-full px-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-600/30 transition-colors duration-200"
                  >
                    <span>🗑</span> Delete All
                  </button>
                </div>
              </div>
            </div>

            <div
              class="bg-white dark:bg-gray-700 rounded-b-lg shadow-sm p-4 flex-1 min-h-[200px] border border-t-0 transition-colors"
              :class="{
                'border-blue-200 dark:border-blue-700': column === 'todo',
                'border-yellow-200 dark:border-yellow-700':
                  column === 'inprogress',
                'border-green-200 dark:border-green-700': column === 'done',
              }"
              @dragover.prevent
              @drop="onDrop($event, column)"
            >
              <!-- Empty state -->
              <div class="flex flex-col gap-4">
                <div
                  v-if="
                    columns[column].cards.length === 0 ||
                    filteredAndSortedCards(column).length === 0
                  "
                  class="text-gray-400 dark:text-gray-500 text-sm italic py-8 text-center border-2 border-dashed rounded-lg"
                  :class="{
                    'border-blue-100 dark:border-blue-700/40':
                      column === 'todo',
                    'border-yellow-100 dark:border-yellow-700/40':
                      column === 'inprogress',
                    'border-green-100 dark:border-green-700/40':
                      column === 'done',
                  }"
                >
                  Drop Tasks here
                </div>
                <div
                  v-if="filteredAndSortedCards(column).length === 0"
                  class="text-gray-400 dark:text-gray-500 text-sm italic py-8 text-center border-2 border-dashed rounded-lg"
                  :class="{
                    'border-blue-100 dark:border-blue-700/40':
                      column === 'todo',
                    'border-yellow-100 dark:border-yellow-700/40':
                      column === 'inprogress',
                    'border-green-100 dark:border-green-700/40':
                      column === 'done',
                  }"
                >
                  No Tasks Found Here
                </div>
              </div>

              <!-- Card -->
              <div
                @click="startEdit(card, column)"
                v-for="card in filteredAndSortedCards(column)"
                :key="card.id"
                class="group bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 cursor-grab border hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm hover:shadow-md relative"
                :class="{
                  'border-blue-100 dark:border-blue-700 dark:border-t-0':
                    column === 'todo',
                  'border-yellow-100 dark:border-yellow-700 dark:border-t-0':
                    column === 'inprogress',
                  'border-green-100 dark:border-green-700 dark:border-t-0':
                    column === 'done',
                }"
                draggable="true"
                @dragstart="onDragStart($event, card.id, column)"
                @dragend="onDragEnd"
              >
                <!-- Priority bar -->
                <div
                  class="absolute top-0 left-0 h-1.5 w-full rounded-t-xl"
                  :class="{
                    'bg-red-700 dark:bg-red-900': card.priority === 'HIGH',
                    'bg-orange-600 dark:bg-orange-800':
                      card.priority === 'MEDIUM',
                    'bg-slate-500': card.priority === 'LOW',
                  }"
                ></div>

                <div class="flex items-start justify-between gap-2 pt-1">
                  <div class="flex-1">
                    <!-- Title + Actions -->
                    <div class="flex items-start justify-between mb-2">
                      <div
                        class="font-semibold text-gray-800 dark:text-gray-100 pr-4"
                      >
                        {{ card.title }}
                      </div>

                      <div class="flex items-center gap-2">
                        <!-- Priority Badge -->
                        <div
                          class="flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full"
                          :class="{
                            'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200':
                              card.priority === 'HIGH',
                            'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                              card.priority === 'MEDIUM',
                            'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-300':
                              card.priority === 'LOW',
                          }"
                        >
                          {{ formatPriority(card.priority) }}
                        </div>

                        <!-- ⋮ Dropdown Menu -->
                        <div class="relative">
                          <button
                            @click.stop="toggleDropdown(card.id)"
                            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </button>

                          <!-- Actions Dropdown -->
                          <div
                            v-if="dropdownOpen === card.id"
                            class="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 divide-y divide-gray-100 dark:divide-gray-700"
                          >
                            <!-- Move to -->
                            <div
                              class="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Move to
                            </div>
                            <div>
                              <button
                                v-for="colKey in columnsOrder.filter(
                                  (c) => c !== column
                                )"
                                :key="colKey"
                                @click="moveCard(card.id, colKey)"
                                class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <span
                                  class="w-2 h-2 rounded-full"
                                  :class="{
                                    'bg-blue-500': colKey === 'todo',
                                    'bg-yellow-500': colKey === 'inprogress',
                                    'bg-green-500': colKey === 'done',
                                  }"
                                ></span>
                                {{ columns[colKey].name }}
                              </button>
                            </div>

                            <!-- Edit/Clone/Delete -->
                            <div class="p-2">
                              <button
                                @click="startEdit(card, column)"
                                class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                ✏ Edit
                              </button>
                              <button
                                @click.stop="cloneTask(card)"
                                class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                ⎘ Clone
                              </button>
                              <button
                                @click.stop="showDeleteModal(card.id)"
                                class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Description -->
                    <div
                      v-if="card.description"
                      class="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert mb-3 line-clamp-2"
                      v-html="card.description"
                    ></div>

                    <!-- Tags -->
                    <div
                      v-if="card.tags && card.tags.length"
                      class="flex flex-wrap gap-1.5 mb-3"
                    >
                      <span
                        v-for="tag in card.tags"
                        :key="tag"
                        class="px-2.5 py-1 text-xs font-medium rounded-full border bg-teal-100 dark:bg-teal-900"
                      >
                        {{ tag }}
                      </span>
                    </div>

                    <!-- Due Date & Assigned User -->
                    <div
                      class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2"
                    >
                      <div class="flex items-center gap-2">
                        <!-- Always show the date if it exists -->
                        <div
                          v-if="card.dueDate"
                          class="flex items-center gap-1"
                        >
                          📅
                          <span>{{
                            new Date(card.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }}</span>
                        </div>

                        <!-- Show overdue badge if expired -->
                        <span
                          v-if="
                            card.dueDate && new Date(card.dueDate) < new Date()
                          "
                          class="px-3 py-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 text-xs font-bold"
                        >
                          Overdue
                        </span>
                      </div>

                      <!-- Assigned User -->
                      <div
                        v-if="card.assignedUser"
                        class="flex items-center gap-2"
                      >
                        <!-- User badge with tooltip -->
                        <div class="relative group">
                          <span
                            class="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xs cursor-pointer"
                          >
                            {{ getUserInitials(card.assignedUser) }}
                          </span>

                          <!-- Tooltip -->
                          <div
                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
                          >
                            {{ getUserName(card.assignedUser) }}
                            <div
                              class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Footer: createdAt -->
                    <div
                      class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-600"
                    >
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(card.createdAt) }}
                      </div>
                      <div
                        class="w-2 h-2 rounded-full"
                        :class="{
                          'bg-blue-500': column === 'todo',
                          'bg-yellow-500': column === 'inprogress',
                          'bg-green-500': column === 'done',
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Modal -->
        <AddTaskModal
          v-model:visible="showAddModal"
          @add="addNewTask"
          @error="showToast($event, 'error')"
        />

        <!-- Edit Modal -->
        <EditTaskModal
          v-model:visible="editing"
          :task="editForm"
          :is-cloning="isCloning"
          @save="saveEdit"
          @clone="confirmClone"
          @error="showToast($event, 'error')"
        />

        <!-- Delete Modal -->
        <div
          v-if="showDeleteConfirmation"
          class="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div
            class="absolute inset-0 bg-black bg-opacity-40"
            @click="showDeleteConfirmation = false"
          ></div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
          >
            <div class="p-6">
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
              >
                Delete Task
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
            </div>
            <div
              class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3"
            >
              <button
                @click="showDeleteConfirmation = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Delete All Modal -->
        <div
          v-if="showDeleteAllModal"
          class="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div
            class="absolute inset-0 bg-black bg-opacity-40"
            @click="showDeleteAllModal = false"
          ></div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
          >
            <div class="p-6">
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
              >
                Delete All Tasks
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete
                <span v-if="deleteAllTarget === 'project'"
                  >all tasks in the project</span
                >
                <span v-else
                  >all tasks in "{{ columns[deleteAllTarget].name }}"</span
                >? This action cannot be undone.
              </p>
            </div>
            <div
              class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3"
            >
              <button
                @click="showDeleteAllModal = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                @click="confirmDeleteAllAction"
                class="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>

        <!-- Toast Notification -->
        <ToastNotification
          v-if="toast.show"
          :message="toast.message"
          :type="toast.type"
          @close="toast.show = false"
        />
      </div>
    </Layout>
  </AuthWrapper>
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  computed,
  onBeforeUnmount,
  watch,
} from "vue";
import { useDark, useToggle } from "@vueuse/core";
import EditTaskModal from "./components/EditTaskModal.vue";
import AddTaskModal from "./components/AddTaskModal.vue";
import ToastNotification from "./components/ToastNotification.vue";
import AuthWrapper from "./components/AuthWrapper.vue";
import Layout from "./components/Layout.vue";
import { useProjects } from "./composables/useProjects.js";
import { tasksAPI } from "./api/tasks.js";
import { useClerkAuth } from "./composables/useClerkAuth.js";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const { isClerkReady, authError, initializeClerk, getAuthToken } =
  useClerkAuth();

// Project management
const {
  projects,
  currentProject,
  loadProjects,
  createProject,
  switchProject,
  deleteProject,
  updateCurrentProject,
  updateProjectTaskCount,
} = useProjects();

const projectDropdownOpen = ref(false);
const columnDropdownOpen = ref(null);
const showDeleteAllModal = ref(false);
const deleteAllTarget = ref(null);

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    projectDropdownOpen.value = false;
    columnDropdownOpen.value = null;
    dropdownOpen.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Search and filter state
const searchQuery = ref("");
const userFilter = ref("");
const tagFilter = ref("");
const sortBy = ref("priority");

// Demo users (you might want to fetch these from backend)
const demoUsers = [
  { id: "u1", name: "Alice Johnson" },
  { id: "u2", name: "Bob Smith" },
  { id: "u3", name: "Charlie Davis" },
];

// Compute all unique tags across all tasks
const allTags = computed(() => {
  const tags = new Set();
  for (const column of columnsOrder) {
    for (const card of columns[column].cards) {
      if (card.tags) {
        for (const tag of card.tags) {
          tags.add(tag);
        }
      }
    }
  }
  return Array.from(tags).sort();
});

// Filter and sort cards for a column
function filteredAndSortedCards(columnKey) {
  let cards = [...columns[columnKey].cards];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    cards = cards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query)) ||
        (card.tags &&
          card.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
  }

  // Apply user filter
  if (userFilter.value) {
    cards = cards.filter((card) => card.assignedUser === userFilter.value);
  }

  // Apply tag filter
  if (tagFilter.value) {
    cards = cards.filter(
      (card) => card.tags && card.tags.includes(tagFilter.value)
    );
  }

  // Apply sorting
  const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  switch (sortBy.value) {
    case "priority":
      cards.sort(
        (a, b) =>
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      );
      break;
    case "dueDate":
      cards.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      break;
    case "createdAt":
      cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "title":
      cards.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return cards;
}

// Toggle column dropdown
function toggleColumnDropdown(col) {
  columnDropdownOpen.value = columnDropdownOpen.value === col ? null : col;
}

function confirmDeleteAll(columnKey) {
  deleteAllTarget.value = columnKey;
  showDeleteAllModal.value = true;
  columnDropdownOpen.value = null;
}

function confirmDeleteAllProject() {
  deleteAllTarget.value = "project";
  showDeleteAllModal.value = true;
  projectDropdownOpen.value = false;
}

async function confirmDeleteAllAction() {
  try {
    if (deleteAllTarget.value === "project") {
      // Delete all tasks in project
      if (currentProject.value) {
        const tasks = await tasksAPI.getByProject(currentProject.value.id);
        for (const task of tasks.data) {
          await tasksAPI.delete(task.id);
        }
      }
      // Clear local state
      for (const k of columnsOrder) {
        columns[k].cards.splice(0);
      }
      showToast("All project tasks deleted", "success");
    } else {
      // Delete all tasks in specific column
      const columnKey = deleteAllTarget.value;
      const status = columnKey.toUpperCase();

      if (currentProject.value) {
        const tasks = await tasksAPI.getByProject(currentProject.value.id);
        const columnTasks = tasks.data.filter((task) => task.status === status);

        for (const task of columnTasks) {
          await tasksAPI.delete(task.id);
        }
      }

      // Clear local state
      columns[columnKey].cards.splice(0);
      showToast(`All tasks deleted from ${columns[columnKey].name}`, "success");
    }
  } catch (error) {
    console.error("Error deleting all tasks:", error);
    showToast("Failed to delete tasks", "error");
  }

  showDeleteAllModal.value = false;
  deleteAllTarget.value = null;
}

function getUserName(userId) {
  return demoUsers.find((u) => u.id === userId)?.name || "Unknown";
}

function getUserInitials(userId) {
  const name = getUserName(userId);
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatPriority(priority) {
  const priorityMap = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
  };
  return priorityMap[priority] || priority;
}

const columns = reactive({
  todo: { name: "To Do", cards: [] },
  inprogress: { name: "In Progress", cards: [] },
  done: { name: "Done", cards: [] },
});

const columnsOrder = ["todo", "inprogress", "done"];
const dropdownOpen = ref(null);
const showDeleteConfirmation = ref(false);
const cardToDelete = ref(null);

// Toast notification setup
const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

function showToast(message, type = "success") {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
}

const showAddModal = ref(false);

// Add a reactive variable for the board title
const boardTitle = ref("Project Kanban Board");

// Function to update and save title
function updateBoardTitle(newTitle) {
  boardTitle.value = newTitle;
  if (currentProject.value) {
    updateCurrentProject({ name: newTitle });
  }
}

// Load project data when current project changes
watch(currentProject, async (newProject) => {
  if (newProject) {
    await loadProjectData();
  }
});

// Load tasks for current project
async function loadProjectData() {
  if (!currentProject.value) return;

  try {
    const response = await tasksAPI.getByProject(currentProject.value.id);
    const tasks = response.data;

    // Clear existing cards
    columns.todo.cards = [];
    columns.inprogress.cards = [];
    columns.done.cards = [];

    // Sort tasks into columns based on status
    tasks.forEach((task) => {
      const status = task.status?.toLowerCase();
      if (columns[status]) {
        columns[status].cards.push({
          ...task,
          // Map backend fields to frontend format
          assignedUser: task.assignedUserId,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
        });
      }
    });

    // Load title
    boardTitle.value = currentProject.value.name || "Project Kanban Board";
  } catch (error) {
    console.error("Error loading project data:", error);
    showToast("Failed to load project data", "error");
  }
}

// Add new task
async function addNewTask(task) {
  try {
    const taskData = {
      title: task.title,
      description: task.description,
      tags: task.tags || [],
      projectId: currentProject.value.id,
      status: "TODO", // Default to todo
      priority: task.priority.toUpperCase(),
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      assignedUserId: task.assignedUser || null, // Map assignedUser to assignedUserId
    };

    console.log("Creating task with data:", taskData);

    const response = await tasksAPI.create(taskData);
    const newTask = response.data;

    // Add to appropriate column
    const status = newTask.status.toLowerCase();
    if (columns[status]) {
      columns[status].cards.unshift({
        ...newTask,
        assignedUser: newTask.assignedUserId, // Map back for frontend display
      });
    }

    showToast("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error);
    showToast("Failed to add task", "error");
    throw error;
  }
}

// Project management event handlers
async function handleProjectChange(project) {
  await switchProject(project.id);
}

async function handleProjectCreate(projectData) {
  const newProject = await createProject(projectData);
  await switchProject(newProject.id);
  showToast(`Project "${newProject.name}" created successfully`);
}

async function handleProjectDelete(projectId) {
  await deleteProject(projectId);
  showToast("Project deleted successfully");
}

// Drag and drop functions
function onDragStart(e, cardId, fromColumn) {
  e.dataTransfer.setData("text/plain", JSON.stringify({ cardId, fromColumn }));
  setTimeout(() => {
    e.target.classList.add("opacity-30");
  }, 0);
}

function onDragEnd(e) {
  e.target.classList.remove("opacity-30");
}

async function onDrop(e, toColumn) {
  e.preventDefault();

  let payload = null;
  try {
    payload = JSON.parse(e.dataTransfer.getData("text/plain"));
  } catch {}

  const cardId = payload?.cardId;
  const fromColumn = payload?.fromColumn;

  if (!cardId || !fromColumn) return;
  if (fromColumn === toColumn) return;

  try {
    // Update task status in backend
    const status = toColumn.toUpperCase();
    await tasksAPI.move(cardId, status);

    // Update local state
    const fromCol = columns[fromColumn];
    const toCol = columns[toColumn];

    const idx = fromCol.cards.findIndex((c) => c.id === cardId);
    if (idx === -1) return;

    const [card] = fromCol.cards.splice(idx, 1);
    card.status = status;
    toCol.cards.unshift(card);

    showToast(`Task moved to ${columns[toColumn].name}`);
  } catch (error) {
    console.error("Error moving task:", error);
    showToast("Failed to move task", "error");
  }
}

function toggleDropdown(id) {
  dropdownOpen.value = dropdownOpen.value === id ? null : id;
}

async function moveCard(cardId, targetColumn) {
  try {
    // Update task status in backend
    const status = targetColumn.toUpperCase();
    await tasksAPI.move(cardId, status);

    // Update local state
    for (const k of columnsOrder) {
      const i = columns[k].cards.findIndex((c) => c.id === cardId);
      if (i > -1) {
        const [card] = columns[k].cards.splice(i, 1);
        card.status = status;
        columns[targetColumn].cards.unshift(card);
        dropdownOpen.value = null;
        showToast(`Task moved to ${columns[targetColumn].name}`);
        return;
      }
    }
  } catch (error) {
    console.error("Error moving task:", error);
    showToast("Failed to move task", "error");
  }
}

function showDeleteModal(cardId) {
  cardToDelete.value = cardId;
  showDeleteConfirmation.value = true;
  dropdownOpen.value = null;
}

async function confirmDelete() {
  if (cardToDelete.value) {
    try {
      await tasksAPI.delete(cardToDelete.value);

      // Remove from local state
      for (const k of columnsOrder) {
        const i = columns[k].cards.findIndex(
          (c) => c.id === cardToDelete.value
        );
        if (i > -1) {
          columns[k].cards.splice(i, 1);
          break;
        }
      }

      showToast("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Failed to delete task", "error");
    }
  }
  showDeleteConfirmation.value = false;
  cardToDelete.value = null;
}

// Edit form
const editing = ref(false);
const isCloning = ref(false);
const editForm = reactive({
  id: "",
  title: "",
  description: "",
  tags: [],
  priority: "MEDIUM",
  dueDate: "",
  assignedUser: "",
});

// Start editing a task
function startEdit(card, fromColumn) {
  Object.assign(editForm, {
    id: card.id,
    title: card.title,
    description: card.description || "",
    tags: [...(card.tags || [])],
    priority: card.priority,
    dueDate: formatDateForInput(card.dueDate),
    assignedUser: card.assignedUser || "",
  });

  isCloning.value = false;
  editing.value = true;
  dropdownOpen.value = null;
}

// Clone task function
function cloneTask(card) {
  const currentColumn = findCardColumn(card.id);
  if (!currentColumn) return;

  // Generate a suggested title for the clone
  const existingCopies = columns[currentColumn].cards.filter((c) => {
    const baseTitle = card.title.replace(/\s*\(Copy.*\)$/, "");
    return c.title.startsWith(baseTitle);
  });

  let copyNumber = 1;
  const existingNumbers = existingCopies
    .map((c) => {
      const match = c.title.match(/\(Copy (\d+)\)$/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n) => n !== null);

  if (existingNumbers.length > 0) {
    copyNumber = Math.max(...existingNumbers) + 1;
  }

  const baseTitle = card.title.replace(/\s*\(Copy.*\)$/, "");
  const suggestedTitle = `${baseTitle} (Copy ${copyNumber})`;

  // Populate the edit form with the card data and suggested title
  Object.assign(editForm, {
    id: card.id, // Keep original ID for reference
    title: suggestedTitle,
    description: card.description || "",
    tags: [...(card.tags || [])],
    priority: card.priority,
    dueDate: formatDateForInput(card.dueDate),
    assignedUser: card.assignedUser || "",
  });

  // Set cloning mode and open the modal
  isCloning.value = true;
  editing.value = true;
  dropdownOpen.value = null;
}

// Save edited task
async function saveEdit(updatedTask) {
  try {
    if (isCloning.value) {
      // If we're in cloning mode, create a new task
      await handleCloneTask(updatedTask);
      return;
    }

    // Regular edit functionality
    const taskData = {
      title: updatedTask.title,
      description: updatedTask.description,
      tags: updatedTask.tags || [],
      priority: updatedTask.priority,
      dueDate: ensureISODate(updatedTask.dueDate),
      assignedUserId: updatedTask.assignedUser || null,
    };

    console.log("Updating task:", updatedTask.id, taskData);

    // Update in backend
    const response = await tasksAPI.update(updatedTask.id, taskData);
    const updatedTaskFromAPI = response.data;

    // Update local state
    for (const column of columnsOrder) {
      const index = columns[column].cards.findIndex(
        (c) => c.id === updatedTask.id
      );
      if (index > -1) {
        columns[column].cards[index] = {
          ...columns[column].cards[index],
          ...updatedTaskFromAPI,
          assignedUser: updatedTaskFromAPI.assignedUserId,
        };
        break;
      }
    }

    showToast("Task updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);
    showToast("Failed to update task", "error");
  } finally {
    editing.value = false;
    isCloning.value = false;
  }
}

// Handle task cloning - this is called when the clone button is clicked in the modal
async function confirmClone(cloneData) {
  try {
    await handleCloneTask(cloneData);
  } catch (error) {
    // Error is already handled in handleCloneTask
  }
}

// Handle task cloning logic
async function handleCloneTask(cloneData) {
  try {
    const taskData = {
      title: cloneData.title,
      description: cloneData.description,
      tags: cloneData.tags || [],
      projectId: currentProject.value.id,
      status: "TODO", // Default to todo for clones
      priority: cloneData.priority,
      dueDate: ensureISODate(cloneData.dueDate),
      assignedUserId: cloneData.assignedUser || null,
    };

    console.log("Creating cloned task:", taskData);

    const response = await tasksAPI.create(taskData);
    const newTask = response.data;

    // Add to appropriate column (TODO by default for clones)
    const status = newTask.status.toLowerCase();
    if (columns[status]) {
      columns[status].cards.unshift({
        ...newTask,
        assignedUser: newTask.assignedUserId,
      });
    }

    showToast("Task cloned successfully");
    editing.value = false;
    isCloning.value = false;
  } catch (error) {
    console.error("Error cloning task:", error);
    showToast("Failed to clone task", "error");
    throw error;
  }
}

// Helper function to find which column a card is in
function findCardColumn(cardId) {
  for (const column of columnsOrder) {
    if (columns[column].cards.some((card) => card.id === cardId)) {
      return column;
    }
  }
  return null;
}

// Helper function to format dates for input fields
function formatDateForInput(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// Helper function to ensure proper date format for backend
function ensureISODate(dateString) {
  if (!dateString) return null;
  try {
    return new Date(dateString).toISOString();
  } catch {
    return null;
  }
}

function formatDate(iso) {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// Initialize
onMounted(async () => {
  await loadProjects();
  if (currentProject.value) {
    await loadProjectData();
  }
});

// Test auth function
async function testAuth() {
  console.log("🧪 Testing authentication...");

  try {
    await initializeClerk();
    const token = await getAuthToken();
    console.log("✅ Auth test successful, token length:", token.length);

    // Test API call with the token
    const testResponse = await fetch(
      "https://nestjs-kanban-board.vercel.app/projects",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "🧪 Test API response:",
      testResponse.status,
      testResponse.statusText
    );
  } catch (error) {
    console.error("❌ Auth test failed:", error);
  }
}

// Initialize when component mounts
onMounted(async () => {
  console.log("🚀 Main component mounted");

  // Wait a bit for Clerk to initialize, then test
  setTimeout(() => {
    testAuth();
  }, 1000);

  // Load projects only when Clerk is ready
  watch(isClerkReady, async (ready) => {
    if (ready) {
      console.log("✅ Clerk ready, loading projects...");
      await loadProjects();
      if (currentProject.value) {
        await loadProjectData();
      }
    }
  });
});
</script>

<style>
[draggable="true"] {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.drag-over {
  background-color: #f0f9ff;
  border-color: #93c5fd;
}

/* Toast transition */
.fixed {
  transition: all 0.3s ease;
}

.dark .prose b {
  color: #f9fafb; /* Tailwind gray-50 */
}
</style>
