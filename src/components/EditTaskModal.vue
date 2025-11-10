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
      class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl z-50 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isCloning ? "Clone Task" : "Edit Task" }}
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
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in localForm.tags"
              :key="tag"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(tag)"
                class="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              @keydown.enter="addTag"
              placeholder="Add a tag and press Enter"
              class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              @click="addTag"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
            >
              Add
            </button>
          </div>
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
                value="HIGH"
                v-model="localForm.priority"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              High
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="MEDIUM"
                v-model="localForm.priority"
                class="text-indigo-600 focus:ring-indigo-500"
              />
              Medium
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="LOW"
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
          <div class="relative">
            <select
              v-model="localForm.assignedUser"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              :disabled="loadingUsers"
            >
              <option value="">Select User</option>
              <option 
                v-for="user in availableUsers" 
                :key="user.id" 
                :value="user.id"
              >
                {{ user.name }} 
                <template v-if="user.email">({{ user.email }})</template>
              </option>
            </select>
            <div v-if="loadingUsers" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            </div>
          </div>
          <p v-if="availableUsers.length === 0 && !loadingUsers" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            No users available
          </p>
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
          v-if="isCloning"
          @click="onClone"
          :disabled="!isFormValid"
          class="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Clone
        </button>
        <button
          v-else
          @click="onSave"
          :disabled="!isFormValid"
          class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, nextTick, ref, computed, onMounted } from "vue";
import { useUser } from "@clerk/vue";
import TiptapEditor from "./TiptapEditor.vue";
import { usersAPI } from "../api/user";


const props = defineProps({
  visible: Boolean,
  task: Object,
  isCloning: Boolean,
  availableUsers: { // Use availableUsers prop instead of users
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(["update:visible", "save", "clone", "error"]);

// Get current user from Clerk
const { user: currentClerkUser } = useUser();

// State for users
const loadingUsers = ref(false);
const allUsers = ref([]);
const newTag = ref("");

// Local form state
const localForm = reactive({
  id: "",
  title: "",
  description: "",
  tags: [],
  priority: "MEDIUM",
  dueDate: "",
  assignedUser: "", // This will store Clerk user ID
});

// Computed property for available users
const availableUsers = computed(() => {
  // Use prop if provided, otherwise use locally fetched users
  return props.availableUsers.length > 0 ? props.availableUsers : allUsers.value;
});

// Form validation
const isFormValid = computed(() => {
  return localForm.title.trim() && localForm.dueDate;
});

// Tag management functions
function addTag() {
  if (newTag.value.trim() && !localForm.tags.includes(newTag.value.trim())) {
    localForm.tags.push(newTag.value.trim());
    newTag.value = "";
  }
}

function removeTag(tagToRemove) {
  localForm.tags = localForm.tags.filter(tag => tag !== tagToRemove);
}

// Watch for task changes and update local form
watch(
  () => props.task,
  async (newTask) => {
    if (newTask) {
      Object.assign(localForm, {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || "",
        tags: [...(newTask.tags || [])],
        priority: newTask.priority || "MEDIUM",
        dueDate: formatDateForInput(newTask.dueDate),
        // Map assigned user - use clerkId if available, otherwise use the ID
        assignedUser: newTask.assignedUser?.clerkId || newTask.assignedUserId || "",
      });

      await nextTick();
    }
  },
  { immediate: true, deep: true }
);

// Watch for modal visibility to fetch users and reset form
watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      // Fetch users if not provided via props
      if (props.availableUsers.length === 0) {
        await fetchUsers();
      }
    } else {
      newTag.value = "";
    }
  }
);

// Fetch users from backend
async function fetchUsers() {
  if (loadingUsers.value) return;
  
  try {
    loadingUsers.value = true;
    console.log("🔄 Fetching users for edit modal...");
    
    const response = await usersAPI.getAll();
    allUsers.value = response.data || [];
    
    console.log(`✅ Loaded ${allUsers.value.length} users for edit modal`);
  } catch (error) {
    console.error("❌ Failed to fetch users for edit modal:", error);
    
    // Fallback: use current user only
    if (currentClerkUser.value) {
      allUsers.value = [{
        id: currentClerkUser.value.id, // Clerk user ID
        name: currentClerkUser.value.fullName || 
              currentClerkUser.value.primaryEmailAddress?.emailAddress || 
              'Current User',
        email: currentClerkUser.value.primaryEmailAddress?.emailAddress,
      }];
    }
  } finally {
    loadingUsers.value = false;
  }
}

function formatDateForInput(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

function onCancel() {
  emits("update:visible", false);
}

function validateForm() {
  if (!localForm.title.trim()) {
    emits("error", "Task title is required");
    return false;
  }
  if (!localForm.dueDate) {
    emits("error", "Due date is required");
    return false;
  }
  return true;
}

function onSave() {
  if (!validateForm()) return;
  
  const taskData = { 
    ...localForm,
    dueDate: ensureISODate(localForm.dueDate),
    // assignedUser remains as Clerk user ID - backend will handle mapping
  };
  
  console.log("📤 Saving task with data:", taskData);
  emits("save", taskData);
  emits("update:visible", false);
}

function onClone() {
  if (!validateForm()) return;
  
  const cloneData = { 
    ...localForm,
    dueDate: ensureISODate(localForm.dueDate),
    // assignedUser remains as Clerk user ID - backend will handle mapping
  };
  
  console.log("📤 Cloning task with data:", cloneData);
  emits("clone", cloneData);
  emits("update:visible", false);
}

function ensureISODate(dateString) {
  if (!dateString) return null;
  try {
    return new Date(dateString).toISOString();
  } catch {
    return null;
  }
}
</script>