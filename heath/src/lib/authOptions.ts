import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User, type IUser } from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const email = credentials.email.toLowerCase().trim();

        // 🔧 Quan trọng: dùng findOne + lean<IUser>() để có đúng kiểu
        const user = (await User.findOne({ email }).lean<IUser>()) ?? null;
        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!ok) return null;

        // Ép _id về string khi trả cho NextAuth
        return {
          id: (user as unknown as { _id: string })._id?.toString?.() ?? "",
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
