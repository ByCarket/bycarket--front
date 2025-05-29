"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { NotificationsProvider } from "@/app/utils/Notifications";
import ChatBot from "@/components/ui/ChatBot";
import { SpinnerProvider } from "@/context/SpinnerContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <SpinnerProvider>
          <NotificationsProvider />
          <ChatBot />
          {children}
        </SpinnerProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
