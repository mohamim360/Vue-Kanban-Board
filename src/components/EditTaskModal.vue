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
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
    >
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">Edit Task</h3>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-1">Title*</label>
          <input
            v-model="localForm.title"
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>

          <QuillEditor
            v-model:content="localForm.description"
            contentType="html"
            theme="snow"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium mb-1">Tags</label>
          <TagInput v-model:tags="localForm.tags" />
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium mb-1">Priority*</label>
          <div class="flex gap-4 text-gray-700 dark:text-gray-300">
            <label
              ><input type="radio" value="high" v-model="localForm.priority" />
              High</label
            >
            <label
              ><input
                type="radio"
                value="medium"
                v-model="localForm.priority"
              />
              Medium</label
            >
            <label
              ><input type="radio" value="low" v-model="localForm.priority" />
              Low</label
            >
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium mb-1">Due Date</label>
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
            <option value="">Select user</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3">
        <button @click="onCancel" class="px-4 py-2">Cancel</button>
        <button
          @click="onSave"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, nextTick } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import TagInput from "./TagInput.vue";

const props = defineProps({ visible: Boolean, task: Object });
const emits = defineEmits(["update:visible", "save", "error"]);

const users = [
  { id: "u1", name: "Alice Johnson" },
  { id: "u2", name: "Bob Smith" },
  { id: "u3", name: "Charlie Davis" },
];

const localForm = reactive({
  id: "",
  title: "",
  description: "",
  tags: [],
  priority: "medium",
  dueDate: "",
  assignedUser: "",
});

watch(
  () => props.task,
  async (newTask) => {
    if (newTask) {
      localForm.id = newTask.id;
      localForm.title = newTask.title;
      localForm.description = newTask.description || "";
      localForm.tags = [...(newTask.tags || [])];
      localForm.priority = newTask.priority || "medium";
      localForm.dueDate = newTask.dueDate || "";
      localForm.assignedUser = newTask.assignedUser || "";

      // Force Vue to update the DOM before setting editor content
      await nextTick();
    }
  },
  { immediate: true, deep: true }
);
function onCancel() {
  emits("update:visible", false);
}

function onSave() {
  if (!localForm.title.trim()) {
    emits("error", "Task title is required");
    return;
  }
  emits("save", { ...localForm });
  emits("update:visible", false);
}
</script>
