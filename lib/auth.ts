import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import bcrypt from 'bcryptjs';
import { authConfig } from '../auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const user = db.prepare('SELECT * FROM users WHERE email = ?').get(credentials.email) as any;
          if (!user) return null;

          const isPasswordValid = bcrypt.compareSync(credentials.password as string, user.password_hash);
          if (!isPasswordValid) return null;

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-12345',
});
