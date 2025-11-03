import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

console.log("API Client initialized with base URL:", API_BASE_URL);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    console.log(
      "🔄 Making API request to:",
      config.method?.toUpperCase(),
      config.url
    );

    // Check if Clerk is available
    if (typeof window !== "undefined" && window.Clerk) {
      console.log("🔍 Clerk is available in window");

      try {
        // Get the active session
        const session = window.Clerk.session;
        console.log("🔍 Clerk session:", session ? "Exists" : "No session");

        if (session) {
          const token = await session.getToken();
          console.log(
            "🔍 Token retrieved:",
            token ? `Yes (length: ${token.length})` : "No token"
          );

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("✅ Authorization header added to request");
          } else {
            console.warn("⚠️ No token available from Clerk session");
          }
        } else {
          console.warn("⚠️ No active Clerk session found");
        }
      } catch (error) {
        console.error("❌ Error getting token from Clerk:", error);
      }
    } else {
      console.warn("⚠️ Clerk not available in window object");
    }

    console.log(
      "📤 Final request headers:",
      JSON.stringify(config.headers, null, 2)
    );
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "✅ API Response success:",
      response.status,
      response.config.url
    );
    return response;
  },
  (error) => {
    console.error("❌ API Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.config?.headers,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized - redirecting to sign in");
      if (window.Clerk) {
        window.Clerk.redirectToSignIn();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
