<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto">
      <header
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Project Kanban Board</h1>
          <p class="text-gray-500 text-sm">
            Drag and drop cards between columns
          </p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm transition-colors flex items-center gap-2"
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
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="column in columnsOrder" :key="column" class="flex flex-col">
          <div
            class="flex items-center justify-between mb-4 p-3 rounded-t-lg"
            :class="{
              'bg-blue-100': column === 'todo',
              'bg-yellow-100': column === 'inprogress',
              'bg-green-100': column === 'done',
            }"
          >
            <h2 class="font-semibold text-gray-800 flex items-center gap-2">
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
              class="text-sm font-medium px-2 py-1 rounded-full bg-white bg-opacity-70"
            >
              {{ columns[column].cards.length }}
            </span>
          </div>

          <div
            class="bg-white rounded-b-lg shadow-sm p-4 flex-1 min-h-[200px] border border-t-0"
            :class="{
              'border-blue-200': column === 'todo',
              'border-yellow-200': column === 'inprogress',
              'border-green-200': column === 'done',
            }"
            @dragover.prevent
            @drop="onDrop($event, column)"
          >
            <div
              v-if="columns[column].cards.length === 0"
              class="text-gray-400 text-sm italic py-8 text-center border-2 border-dashed rounded-lg"
              :class="{
                'border-blue-100': column === 'todo',
                'border-yellow-100': column === 'inprogress',
                'border-green-100': column === 'done',
              }"
            >
              Drop cards here
            </div>

            <div
              v-for="card in sortedCards(column)"
              :key="card.id"
              class="group bg-white rounded-lg p-4 mb-4 cursor-grab border hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
              :class="{
                'border-blue-100': column === 'todo',
                'border-yellow-100': column === 'inprogress',
                'border-green-100': column === 'done',
              }"
              draggable="true"
              @dragstart="onDragStart($event, card.id, column)"
              @dragend="onDragEnd"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <div class="font-semibold text-gray-800 mb-1">
                    {{ card.title }}
                  </div>
                  <div
                    class="text-xs font-medium mb-2"
                    :class="{
                      'text-red-500': card.priority === 'high',
                      'text-yellow-500': card.priority === 'medium',
                      'text-green-500': card.priority === 'low',
                    }"
                  >
                    {{ card.priority }} priority
                  </div>
                  <div
                    v-if="card.description"
                    class="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-3"
                  >
                    {{ card.description }}
                  </div>
                  <div
                    v-if="card.tags && card.tags.length"
                    class="flex flex-wrap gap-1 mb-2"
                  >
                    <span
                      v-for="tag in card.tags"
                      :key="tag"
                      class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="relative">
                  <button
                    @click.stop="toggleDropdown(card.id)"
                    class="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
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
                    class="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 divide-y divide-gray-100"
                  >
                    <div
                      class="p-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                      >
                         <span 
                          class="w-2 h-2 rounded-full"
                          :class="{
                            'bg-blue-500': colKey === 'todo',
                            'bg-yellow-500': colKey === 'inprogress',
                            'bg-green-500': colKey === 'done'
                          }"
                        ></span>
                        {{ columns[colKey].name }}
                      </button>
                    </div>
                    <div class="p-2">
                      <button
                        @click="startEdit(card, column)"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        @click="showDeleteModal(card.id)"
                        class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 text-sm flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-2 text-xs text-gray-500">
                {{ formatDate(card.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Task Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-40"
          @click="showAddModal = false"
        ></div>
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
        >
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              Add New Task
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Title*</label
                >
                <input
                  v-model="newTask.title"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Description</label
                >
                <textarea
                  v-model="newTask.description"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="4"
                  placeholder="Task description"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Tags (comma separated)</label
                >
                <input
                  v-model="tagInput"
                  @keyup="processTags"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="design, frontend, bug"
                />
                <div
                  v-if="newTask.tags.length"
                  class="flex flex-wrap gap-2 mt-2"
                >
                  <span
                    v-for="(tag, index) in newTask.tags"
                    :key="index"
                    class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 flex items-center gap-1"
                  >
                    {{ tag }}
                    <button
                      @click="removeTag(index)"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Priority*</label
                >
                <div class="flex gap-4">
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="newTask.priority"
                      value="high"
                      class="h-4 w-4 text-red-500 focus:ring-red-500"
                    />
                    <span>High</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="newTask.priority"
                      value="medium"
                      class="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span>Medium</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="newTask.priority"
                      value="low"
                      class="h-4 w-4 text-green-500 focus:ring-green-500"
                    />
                    <span>Low</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              @click="showAddModal = false"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="addNewTask"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
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
          class="bg-white rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
        >
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Edit Task</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Title*</label
                >
                <input
                  v-model="editForm.title"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Description</label
                >
                <textarea
                  v-model="editForm.description"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Tags (comma separated)</label
                >
                <input
                  v-model="editTagInput"
                  @keyup="processEditTags"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="design, frontend, bug"
                />
                <div
                  v-if="editForm.tags.length"
                  class="flex flex-wrap gap-2 mt-2"
                >
                  <span
                    v-for="(tag, index) in editForm.tags"
                    :key="index"
                    class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 flex items-center gap-1"
                  >
                    {{ tag }}
                    <button
                      @click="removeTagFromEdit(index)"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Priority*</label
                >
                <div class="flex gap-4">
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="editForm.priority"
                      value="high"
                      class="h-4 w-4 text-red-500 focus:ring-red-500"
                    />
                    <span>High</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="editForm.priority"
                      value="medium"
                      class="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span>Medium</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="editForm.priority"
                      value="low"
                      class="h-4 w-4 text-green-500 focus:ring-green-500"
                    />
                    <span>Low</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              @click="closeEdit"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteConfirmation"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-40"
          @click="showDeleteConfirmation = false"
        ></div>
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-0.5">
                <div
                  class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-1">
                  Delete Task
                </h3>
                <p class="text-gray-600">
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              @click="showDeleteConfirmation = false"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";

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

const tagInput = ref("");
const editTagInput = ref("");

// Process tags from comma-separated input
function processTags() {
  if (tagInput.value.includes(",")) {
    const tags = tagInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    newTask.tags = [...new Set(tags)];
    tagInput.value = "";
  }
}

function processEditTags() {
  if (editTagInput.value.includes(",")) {
    const tags = editTagInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    editForm.tags = [...new Set([...editForm.tags, ...tags])];
    editTagInput.value = "";
  }
}

function removeTag(index) {
  newTask.tags.splice(index, 1);
}

function removeTagFromEdit(index) {
  editForm.tags.splice(index, 1);
}

function addNewTask() {
  if (!newTask.title.trim()) return;

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
}

function resetNewTaskForm() {
  newTask.title = "";
  newTask.description = "";
  newTask.tags = [];
  newTask.priority = "medium";
  tagInput.value = "";
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
      // Default sample cards (not removed)
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
  }
}

function save() {
  const payload = {};
  for (const k of columnsOrder) payload[k] = columns[k].cards;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
        break;
      }
    }
  }
  showDeleteConfirmation.value = false;
  cardToDelete.value = null;
}

const editing = ref(false);
const editForm = reactive({
  id: "",
  title: "",
  description: "",
  tags: [],
  priority: "medium",
});

function startEdit(card, fromColumn) {
  editing.value = true;
  editForm.id = card.id;
  editForm.title = card.title;
  editForm.description = card.description || "";
  editForm.tags = [...(card.tags || [])];
  editForm.priority = card.priority || "medium";
  editTagInput.value = "";
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
</style>
