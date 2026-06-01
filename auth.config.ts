export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-12345',
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
} as any;
