import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import { Food } from "@/lib/models/Food";

type Params = { id: string };

// GET /api/foods/:id  (ai cũng xem được)
export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  await connectDB();

  const item = await Food.findById(id);
  if (!item) {
    return NextResponse.json({ message: "Food not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

// PUT /api/foods/:id  (chỉ admin)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
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

// DELETE /api/foods/:id  (chỉ admin)
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  await connectDB();

  const deleted = await Food.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Food not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
