// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import type { AuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // δες το αρχείο πιο κάτω

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // κρατάμε JWT sessions
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        // βάλε EMAIL_SERVER_SECURE="false" αν θες 587 χωρίς TLS
        secure: (process.env.EMAIL_SERVER_SECURE ?? "true") !== "false",
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 24h
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user?.password) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? null, email: user.email ?? null };
      },
    }),
  ],
  pages: { signIn: "/auth/login", verifyRequest: "/auth/verify-request" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) (token as any).id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if ((token as any)?.id && session.user) (session.user as any).id = (token as any).id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
