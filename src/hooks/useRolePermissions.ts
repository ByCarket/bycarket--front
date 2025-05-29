import { useAuthStore } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { getPosts } from "@/services/vehicle.service";

export const useRolePermissions = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const response = await getPosts(1, 1, { userId: user?.id });
        setPostCount(response.total || 0);
      } catch (error) {
        console.error("Error contando posts:", error);
        setPostCount(0);
      }
    };

    if (user?.id) {
      fetchPostCount();
    }
  }, [user?.id]);

  return {
    isAdmin: user?.role === "admin",
    isPremium: user?.role === "premium" || user?.role === "admin",
    isLoggedIn: isAuthenticated && !!user,

    canCreatePost:
      postCount < 3 || user?.role === "premium" || user?.role === "admin",
    remainingPosts: Math.max(3 - postCount, 0),

    canAccessAdminPanel: user?.role === "admin",
    canAccessAIGenerator: user?.role === "premium" || user?.role === "admin",

    canModerateUsers: user?.role === "admin",
    canModeratePosts: user?.role === "admin",
  };
};
