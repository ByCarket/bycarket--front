import { AuthProvider } from "@/context/AuthProvider";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const nunitoSans = Nunito_Sans({
	subsets: ["latin"],
	variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
	title: "ByCarket",
	description:
		"Página intermediario potenciada por IA para facilitar la búsqueda, compra y venta de vehículos.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<link rel="icon" href="/favicon.png" />
			</head>
			<body className={`${nunitoSans.variable} antialiased`}>
				<AuthProvider>
					<Navbar />
					{children}
				</AuthProvider>
			</body>
		</html>
	);
}
