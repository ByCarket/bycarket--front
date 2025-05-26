"use client";

import { User, Car, FileText, Crown, PlusCircle } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { useState } from "react";
import Image from "next/image";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { userData } = useUserData();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const menuItems = [
    { id: "profile", label: "Datos Personales", icon: User },
    { id: "vehicles", label: "Mis vehículos", icon: Car },
    { id: "publications", label: "Mis publicaciones", icon: FileText },
    {
      id: "register-vehicle",
      label: "Registrar un vehículo",
      icon: PlusCircle,
    },
    { id: "premium", label: "Premium", icon: Crown },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white hidden md:block">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-principal-blue flex items-center justify-center text-white font-bold transition-transform duration-300 hover:scale-110 overflow-hidden">
            {userData?.image &&
            typeof userData.image === "string" &&
            userData.image.trim() !== "" ? (
              <div className="relative w-full h-full">
                {userData.image && (
                  <Image
                    src={userData.image}
                    alt={userData.name || "Usuario"}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                )}
              </div>
            ) : (
              <span className="w-full h-full flex items-center justify-center">
                {userData?.name ? getInitials(userData.name) : "U"}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{userData?.name || "Usuario"}</h2>
            <p className="text-sm text-gray-500">
              @
              {userData?.name ||
                (userData?.email ? userData.email.split("@")[0] : "usuario")}
            </p>
          </div>
        </div>

        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setIsHovered(item.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-secondary-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isHovered === item.id ? "scale-125" : ""
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
