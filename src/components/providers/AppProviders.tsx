"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { StripeProvider } from "./StripeProvider";
import { SessionProvider } from "next-auth/react";
import React from "react";
import ChatBot from "@/components/ui/ChatBot";
import { NotificationsContainer } from "@/app/utils/Notifications";
import { SpinnerProvider } from "@/context/SpinnerContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <StripeProvider>
          <SpinnerProvider>
            <ChatBot />
            {children}
          </SpinnerProvider>
          <NotificationsContainer />
        </StripeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
