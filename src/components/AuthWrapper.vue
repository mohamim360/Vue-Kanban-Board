<template>
  <div v-if="isLoaded">
    <!-- Show sign-in page if user is not authenticated -->
    <div
      v-if="!isSignedIn"
      class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
    >
      <div class="w-full max-w-md p-6">
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome to Kanban Board
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Please sign in to access your projects
          </p>
        </div>

        <!-- Clerk Sign-In Component -->
        <SignIn />
      </div>
    </div>

    <!-- Show main app if user is authenticated -->
    <div v-else>
      <slot />
    </div>
  </div>

  <!-- Loading state -->
  <div
    v-else
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse"
      >
        <svg
          class="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          ></path>
        </svg>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useUser, SignIn, useSession } from "@clerk/vue";

const { isLoaded, isSignedIn, user } = useUser();
const { session } = useSession();

// Debug session and token
watch([isLoaded, isSignedIn, session], async ([loaded, signedIn, currentSession]) => {
  if (loaded && signedIn && currentSession) {
    console.log('User authenticated:', user.value?.fullName);
    try {
      const token = await currentSession.getToken();
      console.log('Session token available:', !!token);
      if (token) {
        console.log('Token preview:', token.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }
});

onMounted(() => {
  console.log('AuthWrapper mounted - isLoaded:', isLoaded.value, 'isSignedIn:', isSignedIn.value);
});
</script>