import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { processGoogleLogin } from "@/services/api.service";
import { setAuthToken } from "@/services/storage.service";

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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async signIn({ user, account, profile }) {
			if (account?.provider === "google" && profile) {
				try {
					const backendResponse = await processGoogleLogin(profile);
					if (backendResponse?.token) {
						setAuthToken(backendResponse.token);
					}
					return true; // ¡Éxito! 🎉
				} catch (error) {
					// Uwaa~ Algo salió mal... 😥
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
			return baseUrl;
		},
	},
});

export { handler as GET, handler as POST };
