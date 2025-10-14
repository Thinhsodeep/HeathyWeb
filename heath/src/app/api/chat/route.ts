// src/app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type PostPayload = {
  message: string;
};

export async function POST(req: Request) {
  try {
    // Parse & validate body
    const body = (await req.json()) as Partial<PostPayload>;
    const message = (body?.message ?? "").toString().trim();

    if (!message) {
      return NextResponse.json(
        { error: "Thiếu 'message' trong request body." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY chưa được cấu hình trên server.");
      return NextResponse.json(
        { error: "Server chưa cấu hình OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Bạn là trợ lý dinh dưỡng AI thân thiện, giúp người dùng ăn uống và tập luyện khoa học.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: `AI request failed: ${msg}` },
      { status: 500 }
    );
  }
}
