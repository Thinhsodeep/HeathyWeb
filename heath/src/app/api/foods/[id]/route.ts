import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Food } from "@/lib/models/Food";

// GET /api/foods/:id
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 🔑 quan trọng: await params
  await connectDB();

  const item = await Food.findById(id);
  if (!item) {
    return NextResponse.json({ message: "Food not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

// PUT /api/foods/:id
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 🔑
  const payload = await req.json();
  await connectDB();

  const updated = await Food.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    return NextResponse.json({ message: "Food not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

// DELETE /api/foods/:id
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 🔑
  await connectDB();

  const deleted = await Food.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Food not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
