<template>
  <div
    class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 flex flex-wrap gap-2 bg-white dark:bg-gray-700"
  >
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
      @keydown.enter.prevent="handleInput"
      @keydown.tab.prevent="handleInput"
      @keydown.space.prevent="handleInput"
      @blur="handleInput"
      placeholder="Type and press Enter, Space or tab"
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

function handleInput(event) {
  // prevent comma from being inserted
  if (event && event.key === ",") event.preventDefault();

  const values = input.value
    .split(/[\s,]+/) // split by space or comma
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && !props.tags.includes(v));

  if (values.length > 0) {
    emit("update:tags", [...props.tags, ...values]);
  }

  input.value = "";
}

function removeTag(index) {
  const newTags = [...props.tags];
  newTags.splice(index, 1);
  emit("update:tags", newTags);
}
</script>
