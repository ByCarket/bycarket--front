import { useEffect, useState } from "react";
import { getPosts } from "@/services/vehicle.service";
import { useUserData } from "@/hooks/useUserData";

export const useRolePermissions = () => {
  const { userData, loading: userDataLoading } = useUserData();
  const [postCount, setPostCount] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPostCount = async () => {
      if (!userData?.id) return;

      setLoadingPosts(true);
      try {
        const response = await getPosts(1, 1, { userId: userData.id });
        setPostCount(response.total || 0);
      } catch (error) {
        console.error("Error contando posts:", error);
        setPostCount(0);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPostCount();
  }, [userData?.id]);

  const role = userData?.role;
  const isAdmin = role === "admin";
  const isPremium = role === "premium" || isAdmin;

  const maxFreePosts = 3;
  const canCreatePost = isAdmin || isPremium || postCount < maxFreePosts;
  const remainingPosts =
    isAdmin || isPremium ? Infinity : Math.max(maxFreePosts - postCount, 0);

  return {
    loading: userDataLoading || loadingPosts,
    isAdmin,
    isPremium,
    isLoggedIn: !!userData,

    canCreatePost,
    remainingPosts,

    canAccessAdminPanel: isAdmin,
    canAccessAIGenerator: isPremium,

    canModerateUsers: isAdmin,
    canModeratePosts: isAdmin,
  };
};
