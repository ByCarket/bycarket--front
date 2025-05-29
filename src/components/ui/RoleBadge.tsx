import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useAuthStore } from "@/context/AuthContext";

const RoleBadge = () => {
  const { isAdmin, isPremium } = useRolePermissions();
  const { user } = useAuthStore();

  if (user?.role === "admin") {
    return <div className="text-sm font-medium text-red-600">Admin</div>;
  }

  if (user?.role === "premium") {
    return (
      <div className="text-sm font-medium text-principal-blue">Premium</div>
    );
  }

  return null;
};

export { RoleBadge };
