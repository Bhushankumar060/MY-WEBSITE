import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sovereign Protocol",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded admin as requested by Phase 1
        if (
          credentials?.email === "admin@tradesovereign.com" &&
          credentials?.password === "Admin@2026!"
        ) {
          return { id: "1", name: "Sovereign Admin", email: "admin@tradesovereign.com", role: "ADMIN" };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/sovereign-control/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
