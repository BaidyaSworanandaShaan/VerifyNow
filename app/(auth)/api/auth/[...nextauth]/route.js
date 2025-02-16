import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Verify password
        const isValidPassword = await compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Set in .env
  callbacks: {
    // The JWT callback is triggered whenever a JWT is created (login) or updated (session refresh)
    async jwt({ token, account, user }) {
      // Add user data to the token for session purposes
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    // The session callback is triggered whenever a session is created or accessed
    async session({ session, token }) {
      // Attach user data from the token to the session object
      session.token = token;
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },

    // The redirect callback is triggered whenever a redirect happens after login
    async redirect({ url, baseUrl }) {
      // You can control the redirect URL based on the outcome of the login
      if (url === "/") {
        return baseUrl; // Redirect to home page after login
      }
      return url;
    },

    // The signIn callback can be used to control if a user can sign in
    async signIn({ user, account, profile }) {
      if (user) {
        // You can customize the signIn process if needed (e.g., check user roles)
        return true; // Allow sign in
      } else {
        return false; // Reject sign in
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
