import { NextResponse } from "next/server";
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
  try {
    await connectDB();
    const body = (await req.json()) as FoodBody;
    const created = await Food.create(body);
    return NextResponse.json(created);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
