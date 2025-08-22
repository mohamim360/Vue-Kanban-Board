<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="mx-auto text-gray-800 dark:text-gray-100">
      <header
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Project Kanban Board
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Drag and drop cards between columns
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Add Task Button -->
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 rounded-lg shadow-sm transition-colors flex items-center gap-2"
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

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDark()"
            class="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm transition-colors"
          >
            <MoonIcon v-if="isDark" class="h-5 w-5" />
            <SunIcon v-else class="h-5 w-5" />
          </button>
        </div>
      </header>

      <!-- Kanban Columns -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="column in columnsOrder" :key="column" class="flex flex-col">
          <div
            class="flex items-center justify-between mb-4 p-3 rounded-t-lg transition-colors"
            :class="{
              'bg-blue-100 dark:bg-blue-900/40': column === 'todo',
              'bg-yellow-100 dark:bg-yellow-900/40': column === 'inprogress',
              'bg-green-100 dark:bg-green-900/40': column === 'done',
            }"
          >
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
              {{ columns[column].cards.length }}
            </span>
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
            <div
              v-if="columns[column].cards.length === 0"
              class="text-gray-400 dark:text-gray-500 text-sm italic py-8 text-center border-2 border-dashed rounded-lg"
              :class="{
                'border-blue-100 dark:border-blue-700/40': column === 'todo',
                'border-yellow-100 dark:border-yellow-700/40':
                  column === 'inprogress',
                'border-green-100 dark:border-green-700/40': column === 'done',
              }"
            >
              Drop cards here
            </div>

            <!-- Card -->
            <div
              v-for="card in sortedCards(column)"
              :key="card.id"
              class="group bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 cursor-grab border hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm hover:shadow-md relative"
              :class="{
                'border-blue-100 dark:border-blue-700 dark:border-t-0': column === 'todo',
                'border-yellow-100 dark:border-yellow-700 dark:border-t-0':
                  column === 'inprogress',
                'border-green-100 dark:border-green-700 dark:border-t-0': column === 'done',
              }"
              draggable="true"
              @dragstart="onDragStart($event, card.id, column)"
              @dragend="onDragEnd"
            >
              <!-- Priority bar -->
              <div
                class="absolute top-0 left-0 h-1.5 w-full rounded-t-xl"
                :class="{
                  'bg-red-700 dark:bg-red-900': card.priority === 'high',
                  'bg-orange-600 dark:bg-orange-800':
                    card.priority === 'medium',
                  'bg-slate-500 ': card.priority === 'low',
                }"
              ></div>

              <div class="flex items-start justify-between gap-2 pt-1">
                <div class="flex-1">
                  <!-- Title -->
                  <div class="flex items-start justify-between mb-2">
                    <div
                      class="font-semibold text-gray-800 dark:text-gray-100 pr-4"
                    >
                      {{ card.title }}
                    </div>

                    <div class="flex items-center gap-2">
                      <div
                        class="flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full"
                        :class="{
                          'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200':
                            card.priority === 'high',
                          'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                            card.priority === 'medium',
                          'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-300':
                            card.priority === 'low',
                        }"
                      >
                        {{ card.priority }} priority
                      </div>

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

                        <div
                          v-if="dropdownOpen === card.id"
                          class="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 divide-y divide-gray-100 dark:divide-gray-700"
                        >
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
                          <div class="p-2">
                            <button
                              @click="startEdit(card, column)"
                              class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              ✏ Edit
                            </button>
                            <button
                              @click="showDeleteModal(card.id)"
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
                    class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2"
                  >
                    {{ card.description }}
                  </div>

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
                </div>
              </div>

              <!-- Date footer -->
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
      <!-- Add Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-40"
          @click="showAddModal = false"
        ></div>
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
        >
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Add New Task
            </h3>
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Title*</label
                >
                <input
                  v-model="newTask.title"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Description</label
                >
                <textarea
                  v-model="newTask.description"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  rows="4"
                  placeholder="Task description"
                ></textarea>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Tags</label
                >
                <TagInput v-model:tags="newTask.tags" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Priority*</label
                >
                <div class="flex gap-4 text-gray-700 dark:text-gray-300">
                  <label class="flex items-center gap-2"
                    ><input
                      type="radio"
                      v-model="newTask.priority"
                      value="high"
                    />High</label
                  >
                  <label class="flex items-center gap-2"
                    ><input
                      type="radio"
                      v-model="newTask.priority"
                      value="medium"
                    />Medium</label
                  >
                  <label class="flex items-center gap-2"
                    ><input
                      type="radio"
                      v-model="newTask.priority"
                      value="low"
                    />Low</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3"
          >
            <button
              @click="showAddModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              @click="addNewTask"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="editing"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-40"
          @click="closeEdit"
        ></div>
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
        >
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Edit Task
            </h3>
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Title*</label
                >
                <input
                  v-model="editForm.title"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Description</label
                >
                <textarea
                  v-model="editForm.description"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Tags</label
                >
                <TagInput v-model:tags="editForm.tags" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Priority*</label
                >
                <div class="flex gap-4 text-gray-700 dark:text-gray-300">
                  <label
                    ><input
                      type="radio"
                      v-model="editForm.priority"
                      value="high"
                    />High</label
                  >
                  <label
                    ><input
                      type="radio"
                      v-model="editForm.priority"
                      value="medium"
                    />Medium</label
                  >
                  <label
                    ><input
                      type="radio"
                      v-model="editForm.priority"
                      value="low"
                    />Low</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3"
          >
            <button
              @click="closeEdit"
              class="text-gray-700 dark:text-gray-200 px-4 py-2"
            >
              Cancel
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>

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

      <!-- Toast Notification -->
      <div v-if="toast.show" class="fixed bottom-4 right-4 z-50">
        <div
          class="px-6 py-3 rounded-lg shadow-lg text-white"
          :class="toastClass"
        >
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import TagInput from "./components/TagInput.vue";
import { useDark, useToggle } from "@vueuse/core";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/solid";

const isDark = useDark(); // reactive boolean
const toggleDark = useToggle(isDark);
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
const STORAGE_KEY = "vue-kanban-state";

const columns = reactive({
  todo: { name: "To Do", cards: [] },
  inprogress: { name: "In Progress", cards: [] },
  done: { name: "Done", cards: [] },
});

const columnsOrder = ["todo", "inprogress", "done"];
const dropdownOpen = ref(null);
const dragging = ref(null);
const dragFrom = ref(null);
const showAddModal = ref(false);
const showDeleteConfirmation = ref(false);
const cardToDelete = ref(null);

// New task form
const newTask = reactive({
  title: "",
  description: "",
  tags: [],
  priority: "medium",
});

// Toast notification setup
const toast = reactive({
  show: false,
  message: "",
  type: "success", // can be 'success', 'error', 'info'
});

const toastClass = computed(() => {
  return {
    "bg-green-500": toast.type === "success",
    "bg-red-500": toast.type === "error",
    "bg-blue-500": toast.type === "info",
  };
});

function showToast(message, type = "success") {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
}

// Edit form
const editing = ref(false);
const editForm = reactive({
  id: "",
  title: "",
  description: "",
  tags: [],
  priority: "medium",
});

function addNewTask() {
  if (!newTask.title.trim()) {
    showToast("Task title is required", "error");
    return;
  }

  const card = {
    id: uid(),
    title: newTask.title.trim(),
    description: newTask.description.trim(),
    tags: [...newTask.tags],
    priority: newTask.priority,
    createdAt: now(),
  };

  columns.todo.cards.unshift(card);
  showAddModal.value = false;
  resetNewTaskForm();
  save();
  showToast("Task added successfully");
}

function resetNewTaskForm() {
  newTask.title = "";
  newTask.description = "";
  newTask.tags = [];
  newTask.priority = "medium";
}

function sortedCards(columnKey) {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...columns[columnKey].cards].sort((a, b) => {
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      columnsOrder.forEach((k) => columns[k].cards.splice(0));
      for (const k of columnsOrder) {
        if (parsed[k] && Array.isArray(parsed[k])) {
          columns[k].cards.push(...parsed[k]);
        }
      }
    } else {
      // Default sample cards
      columns.todo.cards.push(
        {
          id: uid(),
          title: "Design landing page",
          description: "Create wireframes for homepage hero section",
          priority: "high",
          tags: ["design", "frontend"],
          createdAt: now(),
        },
        {
          id: uid(),
          title: "User authentication",
          description: "Set up login and registration flows",
          priority: "medium",
          tags: ["backend", "security"],
          createdAt: now(),
        }
      );
      columns.inprogress.cards.push({
        id: uid(),
        title: "API endpoints",
        description: "Implement CRUD operations for main resources",
        priority: "medium",
        tags: ["backend", "api"],
        createdAt: now(),
      });
      columns.done.cards.push({
        id: uid(),
        title: "Project setup",
        description: "Initialize repository and CI pipeline",
        priority: "low",
        tags: ["devops"],
        createdAt: now(),
      });
      save();
    }
  } catch (e) {
    console.error("Failed to load state", e);
    showToast("Failed to load saved data", "error");
  }
}

function save() {
  try {
    const payload = {};
    for (const k of columnsOrder) payload[k] = columns[k].cards;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Failed to save state", e);
    showToast("Failed to save data", "error");
  }
}

onMounted(load);

function onDragStart(e, cardId, fromColumn) {
  dragging.value = cardId;
  dragFrom.value = fromColumn;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", JSON.stringify({ cardId, fromColumn }));
  setTimeout(() => {
    e.target.classList.add("opacity-30");
  }, 0);
}

function onDragEnd(e) {
  e.target.classList.remove("opacity-30");
  dragging.value = null;
  dragFrom.value = null;
}

function onDrop(e, toColumn) {
  e.preventDefault();
  e.target.classList.remove("bg-gray-50");

  let payload = null;
  try {
    payload = JSON.parse(e.dataTransfer.getData("text/plain"));
  } catch {}

  const cardId = payload?.cardId ?? dragging.value;
  const fromColumn = payload?.fromColumn ?? dragFrom.value;

  if (!cardId || !fromColumn) return;
  if (fromColumn === toColumn) return;

  const idx = columns[fromColumn].cards.findIndex((c) => c.id === cardId);
  if (idx === -1) return;

  const [card] = columns[fromColumn].cards.splice(idx, 1);
  columns[toColumn].cards.unshift(card);
  save();
  showToast(`Task moved to ${columns[toColumn].name}`);
}

function toggleDropdown(id) {
  dropdownOpen.value = dropdownOpen.value === id ? null : id;
}

function moveCard(cardId, targetColumn) {
  for (const k of columnsOrder) {
    const i = columns[k].cards.findIndex((c) => c.id === cardId);
    if (i > -1) {
      const [card] = columns[k].cards.splice(i, 1);
      columns[targetColumn].cards.unshift(card);
      dropdownOpen.value = null;
      save();
      showToast(`Task moved to ${columns[targetColumn].name}`);
      return;
    }
  }
}

function showDeleteModal(cardId) {
  cardToDelete.value = cardId;
  showDeleteConfirmation.value = true;
  dropdownOpen.value = null;
}

function confirmDelete() {
  if (cardToDelete.value) {
    for (const k of columnsOrder) {
      const i = columns[k].cards.findIndex((c) => c.id === cardToDelete.value);
      if (i > -1) {
        columns[k].cards.splice(i, 1);
        save();
        showToast("Task deleted successfully");
        break;
      }
    }
  }
  showDeleteConfirmation.value = false;
  cardToDelete.value = null;
}

function startEdit(card, fromColumn) {
  editing.value = true;
  editForm.id = card.id;
  editForm.title = card.title;
  editForm.description = card.description || "";
  editForm.tags = [...(card.tags || [])];
  editForm.priority = card.priority || "medium";
  dropdownOpen.value = null;
}

function closeEdit() {
  editing.value = false;
}

function saveEdit() {
  if (!editForm.id) return;

  for (const k of columnsOrder) {
    const i = columns[k].cards.findIndex((c) => c.id === editForm.id);
    if (i > -1) {
      columns[k].cards[i].title = editForm.title;
      columns[k].cards[i].description = editForm.description;
      columns[k].cards[i].tags = [...editForm.tags];
      columns[k].cards[i].priority = editForm.priority;
      break;
    }
  }

  editing.value = false;
  save();
  showToast("Task updated successfully");
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
</style>
