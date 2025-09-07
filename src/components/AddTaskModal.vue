<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
  >
    <div
      class="absolute inset-0 bg-black bg-opacity-40"
      @click="onCancel"
    ></div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl z-50 overflow-hidden"
    >
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Add New Task
        </h3>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-1">Title<span class="text-red-500">*</span></label>
          <input
            v-model="localForm.title"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter task title"
          />
        </div>

        <!-- Description (Editor) -->
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <div class="border rounded-lg overflow-hidden bg-white dark:bg-gray-700">
            <TiptapEditor
              v-model="localForm.description"
              class="w-full min-h-[150px]"
            />
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium mb-1">Tags</label>
          <TagInput v-model:tags="localForm.tags" />
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium mb-1">Priority<span class="text-red-500">*</span></label>
          <div class="flex gap-4 text-gray-700 dark:text-gray-300">
            <label
              ><input type="radio" value="High" v-model="localForm.priority" />
              High</label
            >
            <label
              ><input
                type="radio"
                value="Medium"
                v-model="localForm.priority"
              />
              Medium</label
            >
            <label
              ><input type="radio" value="Low" v-model="localForm.priority" />
              Low</label
            >
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium mb-1">Due Date<span class="text-red-500">*</span></label>
          <input
            type="date"
            v-model="localForm.dueDate"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <!-- Users -->
        <div>
          <label class="block text-sm font-medium mb-1">Assign to User</label>
          <select
            v-model="localForm.assignedUser"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select User</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3">
        <button
          @click="onCancel"
          class="px-4 py-2 text-gray-700 dark:text-gray-200"
        >
          Cancel
        </button>
        <button
          @click="onAdd"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Save
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