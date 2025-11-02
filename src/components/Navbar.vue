<template>
  <nav
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-1.5"
  >
    <div class="flex items-center justify-between">
      <!-- Left side - Breadcrumb/Title -->
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
          <!-- {{ currentProject?.name || "Select a Project" }} -->
        </h2>
        <div
          v-if="currentProject"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          <!-- {{ currentProject.taskCount || 0 }} tasks -->
        </div>
      </div>

      <!-- Right side - User Profile & Actions -->
      <div class="flex items-center gap-4">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDark()"
          class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <svg
            v-if="isDark"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <svg
            v-else
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
        </button>

        <!-- User Profile Dropdown -->
        <div class="relative" ref="userDropdownRef">
          <button
            @click="userDropdownOpen = !userDropdownOpen"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <!-- User Avatar -->
            <div
              class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center"
            >
              <img
                v-if="user?.imageUrl"
                :src="user.imageUrl"
                :alt="user.fullName"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span v-else class="text-white text-sm font-medium">
                {{ getUserInitials(user?.fullName || "User") }}
              </span>
            </div>

            <!-- User Info -->
            <div class="text-left">
              <div class="text-sm font-medium text-gray-800 dark:text-gray-100">
                {{ user?.fullName || "User" }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{
                  user?.primaryEmailAddress?.emailAddress || "user@example.com"
                }}
              </div>
            </div>

            <!-- Dropdown Arrow -->
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <!-- User Dropdown Menu -->
          <div
            v-if="userDropdownOpen"
            class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center"
                >
                  <img
                    v-if="user?.imageUrl"
                    :src="user.imageUrl"
                    :alt="user.fullName"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <span v-else class="text-white font-medium">
                    {{ getUserInitials(user?.fullName || "User") }}
                  </span>
                </div>
                <div>
                  <div class="font-medium text-gray-800 dark:text-gray-100">
                    {{ user?.fullName || "User" }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{
                      user?.primaryEmailAddress?.emailAddress ||
                      "user@example.com"
                    }}
                  </div>
                </div>
              </div>
            </div>

            <div class="p-2">
              <button
                @click="handleProfile"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Profile Settings
                </div>
              </button>

              <button
                @click="handlePreferences"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Preferences
                </div>
              </button>

              <div
                class="border-t border-gray-200 dark:border-gray-700 my-2"
              ></div>

              <button
                @click="handleSignOut"
                class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Sign Out
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useDark, useToggle } from "@vueuse/core";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  currentProject: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["sign-out"]);

const isDark = useDark();
const toggleDark = useToggle(isDark);
const userDropdownOpen = ref(false);
const userDropdownRef = ref(null);

// Methods
function getUserInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function handleProfile() {
  userDropdownOpen.value = false;
  // Navigate to profile page or show profile modal
  console.log("Navigate to profile");
}

function handlePreferences() {
  userDropdownOpen.value = false;
  // Navigate to preferences page or show preferences modal
  console.log("Navigate to preferences");
}

function handleSignOut() {
  userDropdownOpen.value = false;
  emit("sign-out");
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    userDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
