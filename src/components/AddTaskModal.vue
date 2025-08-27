<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div class="absolute inset-0 bg-black bg-opacity-40" @click="onCancel"></div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Add New Task
        </h3>

        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title*</label>
            <input
              v-model="localForm.title"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Task title"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              v-model="localForm.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Task description"
            ></textarea>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <TagInput v-model:tags="localForm.tags" />
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority*</label>
            <div class="flex gap-4 text-gray-700 dark:text-gray-300">
              <label><input type="radio" value="high" v-model="localForm.priority" /> High</label>
              <label><input type="radio" value="medium" v-model="localForm.priority" /> Medium</label>
              <label><input type="radio" value="low" v-model="localForm.priority" /> Low</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3">
        <button @click="onCancel" class="px-4 py-2 text-gray-700 dark:text-gray-200">Cancel</button>
        <button @click="onAdd" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add Task</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import TagInput from "./TagInput.vue";

const props = defineProps({
  visible: { type: Boolean, required: true },
});

const emits = defineEmits(["update:visible", "add"]);

// Local form state
const localForm = reactive({
  title: "",
  description: "",
  tags: [],
  priority: "medium",
});

// Reset form every time modal opens
watch(
  () => props.visible,
  (val) => {
    if (val) {
      localForm.title = "";
      localForm.description = "";
      localForm.tags = [];
      localForm.priority = "medium";
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
  emits("add", { ...localForm });
  emits("update:visible", false);
}
</script>