import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { processGoogleLogin } from "@/services/api.service";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.CLIENT_ID as string,
			clientSecret: process.env.CLIENT_SECRET as string,
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === "google" && profile) {
				try {
					const backendResponse = await processGoogleLogin(profile);
					if (!backendResponse.user.profileComplete) {
						return `/complete-profile?email=${backendResponse.user.email}`;
					}
					return true;
				} catch (error) {
					console.error("Error processing Google login:", error);
					return false;
				}
			}
			return true;
		},
		async redirect({ url, baseUrl }) {
			if (url.startsWith(baseUrl)) {
				return url;
			}
			if (url.startsWith("/complete-profile")) {
				return `${baseUrl}${url}`;
			}
			return baseUrl;
		},
	},
});

export { handler as GET, handler as POST };
