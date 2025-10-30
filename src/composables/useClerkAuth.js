import { ref, onMounted } from 'vue';

export function useClerkAuth() {
  const isClerkReady = ref(false);
  const authError = ref(null);

  const initializeClerk = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window not available'));
        return;
      }

      if (!window.Clerk) {
        reject(new Error('Clerk not loaded'));
        return;
      }

      // Check if Clerk is loaded and has a user
      const checkClerk = () => {
        if (window.Clerk.loaded) {
          console.log('✅ Clerk is loaded and ready');
          isClerkReady.value = true;
          resolve(true);
        } else {
          console.log('⏳ Clerk not loaded yet, waiting...');
          setTimeout(checkClerk, 100);
        }
      };

      checkClerk();
    });
  };

  const getAuthToken = async () => {
    try {
      if (!window.Clerk || !window.Clerk.session) {
        throw new Error('Clerk session not available');
      }

      const token = await window.Clerk.session.getToken();
      if (!token) {
        throw new Error('No token available from Clerk');
      }

      console.log('🔑 Token retrieved successfully, length:', token.length);
      return token;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      throw error;
    }
  };

  onMounted(() => {
    initializeClerk().catch(error => {
      console.error('❌ Clerk initialization failed:', error);
      authError.value = error.message;
    });
  });

  return {
    isClerkReady,
    authError,
    initializeClerk,
    getAuthToken
  };
}