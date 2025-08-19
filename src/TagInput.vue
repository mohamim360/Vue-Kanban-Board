<template>
  <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 flex flex-wrap gap-2 bg-white dark:bg-gray-700">
    <span
      v-for="(tag, index) in tags"
      :key="tag"
      class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded-full flex items-center gap-1"
    >
      {{ tag }}
      <button
        @click="removeTag(index)"
        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
      >
        ×
      </button>
    </span>

    <input
      v-model="input"
      @keydown.enter.prevent="addTag"
      @keydown.tab.prevent="addTag"
      placeholder="Type and press Enter"
      class="flex-1 min-w-[80px] border-none focus:ring-0 outline-none dark:bg-gray-700 dark:text-gray-100"
    />
  </div>
</template>

<script setup>
import { ref } from "vue"; 

const props = defineProps({
  tags: { type: Array, required: true },
});
const emit = defineEmits(["update:tags"]);

const input = ref("");

function addTag() {
  const val = input.value.trim();
  if (val && !props.tags.includes(val)) {
    emit("update:tags", [...props.tags, val]);
  }
  input.value = "";
}

function removeTag(index) {
  const newTags = [...props.tags];
  newTags.splice(index, 1);
  emit("update:tags", newTags);
}
</script>
