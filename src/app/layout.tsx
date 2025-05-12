import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

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
			<body className={`${nunitoSans.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
