import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) return null;

        const ident = credentials.identifier.trim().toLowerCase();
        const user = await prisma.user.findFirst({
          where: { OR: [{ email: ident }, { username: ident }] },
        });
        if (!user || !user.password) return null;

        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          firstName: user.firstName,
        } as {
          id: string;
          email: string | null;
          name: string | null;
          image: string | null;
          username: string | null;
          firstName: string | null;
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = (user as { id: string }).id;
        token.username =
          (user as { username?: string | null }).username ?? null;
        token.firstName =
          (user as { firstName?: string | null }).firstName ?? null;
      } else if (token.id && (token.username === undefined || token.firstName === undefined)) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { username: true, firstName: true },
        });
        if (fresh) {
          token.username = fresh.username;
          token.firstName = fresh.firstName;
        }
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        username: (token.username as string | null) ?? null,
        firstName: (token.firstName as string | null) ?? null,
      },
    }),
  },
  pages: { signIn: "/login" },
};
