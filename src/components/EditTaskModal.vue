<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div class="absolute inset-0 bg-black bg-opacity-40" @click="onCancel"></div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 overflow-hidden"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Edit Task
        </h3>

        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title*
            </label>
            <input
              v-model="localForm.title"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              v-model="localForm.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            ></textarea>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <TagInput v-model:tags="localForm.tags" />
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority*
            </label>
            <div class="flex gap-4 text-gray-700 dark:text-gray-300">
              <label>
                <input type="radio" value="high" v-model="localForm.priority" /> High
              </label>
              <label>
                <input type="radio" value="medium" v-model="localForm.priority" /> Medium
              </label>
              <label>
                <input type="radio" value="low" v-model="localForm.priority" /> Low
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3">
        <button @click="onCancel" class="text-gray-700 dark:text-gray-200 px-4 py-2">
          Cancel
        </button>
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
import { reactive, watch } from "vue";
import TagInput from "./TagInput.vue";

const props = defineProps({
  visible: { type: Boolean, required: true },
  task: {
    type: Object,
    default: () => ({
      id: "",
      title: "",
      description: "",
      tags: [],
      priority: "medium",
    }),
  },
});

const emits = defineEmits(["update:visible", "save"]);

const localForm = reactive({
  id: "",
  title: "",
  description: "",
  tags: [],
  priority: "medium",
});

// keep localForm in sync with passed task
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      localForm.id = newTask.id;
      localForm.title = newTask.title;
      localForm.description = newTask.description || "";
      localForm.tags = [...(newTask.tags || [])];
      localForm.priority = newTask.priority || "medium";
    }
  },
  { immediate: true, deep: true }
);

// Cancel action
function onCancel() {
  emits("update:visible", false);
}

// Save action
function onSave() {
    if (!localForm.title.trim()) {
    emits("error", "Task title is required");
    return;
  }
  emits("save", { ...localForm });
  emits("update:visible", false);
}
</script>