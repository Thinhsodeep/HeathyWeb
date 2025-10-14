// src/app/api/meal-plans/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan, { type MealPlanDoc } from "@/lib/models/MealPlan";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = (await req.json()) as Pick<
      MealPlanDoc,
      "userId" | "date" | "meals" | "totals"
    >;

    const created = await MealPlan.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
