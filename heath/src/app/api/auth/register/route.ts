import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Thiếu email/mật khẩu" },
        { status: 400 }
      );
    }

    await connectDB();
    const existed = await User.findOne({ email });
    if (existed) {
      return NextResponse.json({ error: "Email đã tồn tại" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHash });

    return NextResponse.json({ id: u._id, email: u.email });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
