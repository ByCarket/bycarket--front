"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface AppProvidersProps {
	children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
	return (
		<SessionProvider>
			<AuthProvider>{children}</AuthProvider>
		</SessionProvider>
	);
}