import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import { Food } from "@/lib/models/Food";

type FoodBody = {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  type?: "breakfast" | "lunch" | "dinner" | "snack";
};

export async function GET() {
  await connectDB();
  const foods = await Food.find();
  return NextResponse.json(foods);
}

export async function POST(req: Request) {
  // ✅ chỉ admin mới được tạo
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const body: FoodBody = await req.json();
    const created = await Food.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
