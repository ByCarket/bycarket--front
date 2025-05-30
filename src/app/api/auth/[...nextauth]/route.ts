import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { processGoogleLogin } from "@/services/api.service";

declare module "next-auth" {
	interface Session {
		backendAccessToken?: string;
		user: {
			id?: string;
			name?: string;
			email?: string;
			image?: string;
		}
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		backendAccessToken?: string;
		userId?: string;
	}
}

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
		async signIn({ account, profile }) {
			if (account?.provider === "google" && profile) {
				try {
					const backendResponse = await processGoogleLogin(profile);
					if (backendResponse?.token) {
						account.access_token = backendResponse.token;
					}
					return true;
				} catch (error) {
					console.error("Error en signIn de NextAuth:", error);
					return false;
				}
			}
			return true;
		},
		async jwt({ token, account, user }) {
			if (account?.access_token) {
				token.backendAccessToken = account.access_token;
			}
			if (user?.id) {
				token.userId = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.backendAccessToken) {
				session.backendAccessToken = token.backendAccessToken;
			}
			if (token?.userId) {
				session.user.id = token.userId;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
