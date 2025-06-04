import { useUserData } from "@/hooks/useUserData";
import { useEffect, useState } from "react";
import { getMyPosts } from "@/services/vehicle.service";

export const useRolePermissions = () => {
  const { userData, loading: userDataLoading } = useUserData();
  const [postCount, setPostCount] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const role = userData?.role;
  const isAdmin = role === "admin";
  const isPremium = role === "premium" || isAdmin;
  const isUser = role === "user";

  const maxFreePosts = 3;

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const posts = await getMyPosts();
        setPostCount(Array.isArray(posts) ? posts.length : 0);
      } catch (error) {
        setPostCount(0);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (!isAdmin && !isPremium) {
      fetchPostCount();
    } else {
      setLoadingPosts(false);
    }
  }, [isAdmin, isPremium]);

  const checkCanCreatePost = async () => {
    if (isAdmin || isPremium) return true;
    if (!isUser) return false;
    return postCount < maxFreePosts;
  };

  const canCreatePost =
    isAdmin || isPremium || (isUser && postCount < maxFreePosts);
  const remainingPosts =
    isAdmin || isPremium
      ? Infinity
      : isUser
      ? Math.max(maxFreePosts - postCount, 0)
      : 0;

  return {
    loading: userDataLoading || loadingPosts,
    isAdmin,
    isPremium,
    isUser,
    isLoggedIn: !!userData,

    canCreatePost,
    remainingPosts,
    checkCanCreatePost,
    postCount,

    canAccessAdminPanel: isAdmin,
    canAccessAIGenerator: isPremium,

    canModerateUsers: isAdmin,
    canModeratePosts: isAdmin,
  };
};
