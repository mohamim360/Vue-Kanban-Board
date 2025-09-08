<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
  >
    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="onCancel"
    ></div>

    <!-- Modal -->
    <div
      class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl z-50 overflow-hidden transform transition-all scale-100"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Add New Task
        </h3>
      </div>

      <!-- Body (scrollable) -->
      <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="localForm.title"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Enter task title"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <div class="border rounded-lg overflow-hidden bg-white dark:bg-gray-700">
            <TiptapEditor
              v-model="localForm.description"
              class="w-full min-h-[150px] max-h-[250px] overflow-y-auto"
            />
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <TagInput v-model:tags="localForm.tags" />
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-6 text-gray-700 dark:text-gray-300">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="High"
                v-model="localForm.priority"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              High
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Medium"
                v-model="localForm.priority"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              Medium
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Low"
                v-model="localForm.priority"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              Low
            </label>
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            v-model="localForm.dueDate"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <!-- Users -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assign to User
          </label>
          <select
            v-model="localForm.assignedUser"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">Select User</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-600">
        <button
          @click="onCancel"
          class="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          @click="onAdd"
          class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition"
        >
          Save Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import TiptapEditor from "./TiptapEditor.vue";
import TagInput from "./TagInput.vue";

const props = defineProps({ visible: Boolean });
const emits = defineEmits(["update:visible", "add", "error"]);

const users = [
  { id: "u1", name: "Alice Johnson" },
  { id: "u2", name: "Bob Smith" },
  { id: "u3", name: "Charlie Davis" },
];

const localForm = reactive({
  title: "",
  description: "",
  tags: [],
  priority: "Medium",
  dueDate: "",
  assignedUser: "",
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      localForm.title = "";
      localForm.description = "";
      localForm.tags = [];
      localForm.priority = "Medium";
      localForm.dueDate = "";
      localForm.assignedUser = "";
    }
  }
);

function onCancel() {
  emits("update:visible", false);
}

function onAdd() {
  if (!localForm.title.trim()) {
    emits("error", "Task title is required");
    return;
  }
  if (!localForm.dueDate) {
    emits("error", "Due date is required");
    return;
  }
  emits("add", { ...localForm });
  emits("update:visible", false);
}
</script>
