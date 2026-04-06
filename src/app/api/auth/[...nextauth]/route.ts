import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "stub-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "stub-client-secret",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-do-not-use-in-production",
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
