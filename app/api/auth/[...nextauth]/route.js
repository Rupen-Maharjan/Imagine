"use server"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { UsrMod } from "@/models/export";
import bcrypt from "bcrypt"
import {v4 as uuid} from 'uuid';

const generateUsernameFromEmail = (email, provide) => {
  const emails = email.split('@')[0];
  const provider = provide;
  return emails + provider; // Use the part of the email before the @ symbol as the username
}

const authOptions = NextAuth({
  // Configure one or more authentication providers
  pages: {
    signIn: "/login",
    signUp: "/signUp"
  },
  providers: [
    Credentials({
      name: "Sign In",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password)
          return null;

        const user = await UsrMod.findOne({ username: credentials.username });
        if (user) {
          const matched = await bcrypt.compare(credentials.password, user.password);
          if (matched) {
            return user;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'google' || account.provider === 'github') {
        const usrname = generateUsernameFromEmail(user.email, account.provider);
        const existingUser = await UsrMod.findOne({ username: usrname });
        if (!existingUser) {
          const newUser = new UsrMod({
            id: uuid(),
            firstName: profile.given_name || '',
            lastName: profile.family_name || '',
            username: usrname,
            email: user.email,
            password: '', // You might want to handle passwords differently for provider logins
          });
          await newUser.save();
        }
        user.username = usrname; // Ensure username is set in the user object
      }
      return true;
    },
    async session({ session, user, token }) {
      // Update session to include username
      if (session.user && token) {
        session.user.username = token.username;
      }
      
      // Search user by username instead of email
      const dbUser = await UsrMod.findOne({ username: session.user.username });
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.email = dbUser.email; // Optionally update the email as well
      }
      return session;
    },
    async jwt({ token, user }) {
      // This is where you persist the username in the JWT token
      if (user) {
        token.username = user.username;
      }
      return token;
    }
  }
});

export { authOptions as GET, authOptions as POST }
