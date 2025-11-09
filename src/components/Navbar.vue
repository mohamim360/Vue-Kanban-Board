<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3 sticky top-0 z-30">
    <div class="flex items-center justify-between">
      <!-- Left side - Mobile menu button and breadcrumb -->
      <div class="flex items-center gap-3 lg:gap-4">
        <!-- Mobile menu button -->
        <button 
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        <!-- Breadcrumb/Title -->
        <div class="flex items-center gap-2 lg:gap-4">
          <h2 class="text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[150px] sm:max-w-[250px] lg:max-w-none">
            {{ currentProject?.name || "Select a Project" }}
          </h2>
          <div
            v-if="currentProject"
            class="text-xs lg:text-sm text-gray-500 dark:text-gray-400 hidden sm:block"
          >
            {{ currentProject.taskCount || 0 }} tasks
          </div>
        </div>
      </div>

      <!-- Right side - User Profile & Actions -->
      <div class="flex items-center gap-2 lg:gap-3">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDark()"
          class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
          title="Toggle dark mode"
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
            class="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <!-- User Avatar -->
            <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 ring-2 ring-white dark:ring-gray-800">
              <img
                v-if="user?.imageUrl"
                :src="user.imageUrl"
                :alt="user.fullName"
                class="w-full h-full rounded-full object-cover"
              />
              <span v-else class="text-white text-sm font-medium">
                {{ getUserInitials(user?.fullName || "User") }}
              </span>
            </div>

            <!-- User Info - Hide on small screens -->
            <div class="text-left hidden md:block">
              <div class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[150px]">
                {{ user?.fullName || "User" }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                {{ user?.primaryEmailAddress?.emailAddress || "user@example.com" }}
              </div>
            </div>

            <!-- Dropdown Arrow - Hide on small screens -->
            <svg
              class="w-4 h-4 text-gray-400 hidden md:block transition-transform"
              :class="{ 'rotate-180': userDropdownOpen }"
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
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="userDropdownOpen"
              class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            >
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <img
                      v-if="user?.imageUrl"
                      :src="user.imageUrl"
                      :alt="user.fullName"
                      class="w-full h-full rounded-full object-cover"
                    />
                    <span v-else class="text-white font-medium">
                      {{ getUserInitials(user?.fullName || "User") }}
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {{ user?.fullName || "User" }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ user?.primaryEmailAddress?.emailAddress || "user@example.com" }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-2">
                <button
                  @click="handleProfile"
                  class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Profile Settings
                  </div>
                </button>

                <button
                  @click="handlePreferences"
                  class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Preferences
                  </div>
                </button>

                <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                <button
                  @click="handleSignOut"
                  class="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Sign Out
                  </div>
                </button>
              </div>
            </div>
          </transition>
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

const emit = defineEmits(["sign-out", "toggle-sidebar"]);

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
  console.log("Navigate to profile");
}

function handlePreferences() {
  userDropdownOpen.value = false;
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

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>