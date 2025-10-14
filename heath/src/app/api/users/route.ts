import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

// GET /api/users  — chỉ dùng để test, nếu sợ lộ data hãy remove hoặc bảo vệ route này
export async function GET() {
  await connectDB();
  const users = await User.find({}, { passwordHash: 0 }).lean(); // ẩn passwordHash
  return NextResponse.json(users);
}
