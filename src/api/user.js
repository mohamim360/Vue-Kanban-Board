import apiClient from "./client";

export const usersAPI = {
  // Get all users from Clerk via your backend
  async getAll() {
    try {
      console.log("🔄 Fetching all users from backend...");
      const response = await apiClient.get('/users');
      console.log("✅ Users fetched successfully:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw error;
    }
  },

  // Get current user info
  async getCurrent() {
    try {
      const response = await apiClient.get('/users/current');
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
};