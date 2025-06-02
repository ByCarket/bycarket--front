import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
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
      role?: string;
      isActive?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    isActive?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    userId?: string;
    role?: string;
    isActive?: boolean;
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      isActive?: boolean;
    };
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
            account.user = backendResponse.user;
          }
          return true;
        } catch (error) {
          console.error("Error en signIn de NextAuth:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account?.access_token) {
        token.backendAccessToken = account.access_token;
        if (account.user) {
          token.user = account.user;
          token.userId = account.user.id;
          token.role = account.user.role;
          token.isActive = account.user.isActive;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.backendAccessToken) {
        session.backendAccessToken = token.backendAccessToken;
      }
      if (token?.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
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
