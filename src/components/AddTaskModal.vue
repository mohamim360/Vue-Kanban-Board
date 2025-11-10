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
          @click="onAdd"
          :disabled="!isFormValid"
          class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, ref, onMounted } from "vue";
import { useUser } from "@clerk/vue";
import TiptapEditor from "./TiptapEditor.vue";
import TagInput from "./TagInput.vue";
import { usersAPI } from "../api/user";

const props = defineProps({ 
  visible: Boolean,
  availableUsers: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(["update:visible", "add", "error"]);

// Get current user from Clerk
const { user: currentClerkUser } = useUser();

// State for users
const loadingUsers = ref(false);
const allUsers = ref([]);

// Local form state
const localForm = reactive({
  title: "",
  description: "",
  tags: [],
  priority: "Medium",
  dueDate: "",
  assignedUser: "",
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

// Fetch users from backend when modal opens
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      // Reset form
      localForm.title = "";
      localForm.description = "";
      localForm.tags = [];
      localForm.priority = "Medium";
      localForm.dueDate = "";
      localForm.assignedUser = "";
      
      // Fetch users if not provided via props
      if (props.availableUsers.length === 0) {
        await fetchUsers();
      }
    }
  }
);

// Fetch users from backend
async function fetchUsers() {
  if (loadingUsers.value) return;
  
  try {
    loadingUsers.value = true;
    console.log("🔄 Fetching users for modal...");
    
    const response = await usersAPI.getAll();
    allUsers.value = response.data || [];
    
    console.log(`✅ Loaded ${allUsers.value.length} users for modal`);
  } catch (error) {
    console.error("❌ Failed to fetch users for modal:", error);
    
    // Fallback: use current user only
    if (currentClerkUser.value) {
      allUsers.value = [{
        id: currentClerkUser.value.id,
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
  
  
  const taskData = {
    ...localForm,
    priority: localForm.priority.toUpperCase() 
  };
  
  emits("add", taskData);
  emits("update:visible", false);
}
</script>