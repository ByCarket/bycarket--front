"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { NotificationsProvider } from "@/app/utils/Notifications";
import ChatBot from "@/components/ui/ChatBot";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <NotificationsProvider />
        <ChatBot />
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
