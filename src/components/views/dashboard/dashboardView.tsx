"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import ProfileContent from "./components/ProfileContent";
import VehiclesContent from "./components/VehiclesContent";
import PublicationsContent from "./components/PostContent";
import PremiumContent from "./components/PremiumContent";
import VehicleForm from "./components/VehicleForm";
import UserListContent from "./components/UserListContent";
import UserPostsContent from "./components/UserPostsContent";
import { useUserData } from "@/hooks/useUserData";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import DatabaseScrapperContent from "./components/DatabaseScrapperContent";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("profile");
  const { loading, userData } = useUserData();
  const { isAdmin } = useRolePermissions();

  useEffect(() => {
    if (tabParam) {
      const validTabs = [
        "profile",
        "vehicles",
        "publications",
        "register-vehicle",
        "publish-vehicle",
        "premium",
        "users",
        "user-posts",
        "database-scrapper",
      ];

      if (isAdmin) {
        validTabs.push("users");
      }

      if (validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab("profile");
      }
    }
  }, [tabParam, isAdmin]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return <ProfileContent />;
      case "vehicles":
        return <VehiclesContent />;
      case "publications":
        return <PublicationsContent />;
      case "register-vehicle":
        return <VehicleForm />;
      case "premium":
        return <PremiumContent />;
      case "users":
        return isAdmin ? <UserListContent /> : <ProfileContent />;
      case "user-posts":
        return isAdmin ? <UserPostsContent /> : <ProfileContent />;
      case "database-scrapper":
        return isAdmin ? <DatabaseScrapperContent /> : <ProfileContent />;
      default:
        return <ProfileContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <main className="flex-1 p-6 md:p-8">{renderContent()}</main>
    </div>
  );
}
