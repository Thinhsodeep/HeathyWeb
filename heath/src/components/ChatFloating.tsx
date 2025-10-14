"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; content: string };

/** UUID an toàn, không dùng any, không khai báo lại Crypto */
function uid(): string {
  const c = globalThis.crypto as Crypto | undefined;

  if (typeof c?.randomUUID === "function") return c.randomUUID();

  if (typeof c?.getRandomValues === "function") {
    const arr = new Uint8Array(16);
    c.getRandomValues(arr);
    arr[6] = (arr[6] & 0x0f) | 0x40; // v4
    arr[8] = (arr[8] & 0x3f) | 0x80; // variant
    const hex = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join(
      ""
    );
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Lỗi không xác định";
  }
}

export default function ChatFloating() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m0",
      role: "assistant",
      content: "Xin chào! Mình là AI dinh dưỡng. Bạn muốn hỏi gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;

    // tạo id tạm duy nhất tránh trùng key
    const tempId = `assistant-temp-${uid()}`;

    const nextMsgs: Msg[] = [
      ...messages,
      { id: uid(), role: "user", content: q },
      { id: tempId, role: "assistant", content: "" },
    ];
    setMessages(nextMsgs);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: nextMsgs.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      // đọc nội dung lỗi để hiển thị rõ ràng
      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Chat API lỗi");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const clone = [...prev];
          const idx = clone.findIndex((m) => m.id === tempId);
          if (idx !== -1) clone[idx] = { ...clone[idx], content: acc };
          return clone;
        });
      }

      // chốt id cố định cho assistant
      setMessages((prev) => {
        const clone = [...prev];
        const idx = clone.findIndex((m) => m.id === tempId);
        if (idx !== -1) clone[idx].id = uid();
        return clone;
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: `Có lỗi xảy ra: ${getErrorMessage(err)}`,
        },
      ]);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <>
      {/* Nút tròn nổi góc phải */}
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg"
          aria-label={open ? "Đóng chat" : "Mở chat"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Panel chat */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-[380px] h-[60vh] bg-background border rounded-2xl shadow-xl flex flex-col"
          role="dialog"
          aria-label="Hộp chat AI"
        >
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-medium">Trợ lý dinh dưỡng</div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Đóng"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow ${
                  m.role === "assistant"
                    ? "bg-background"
                    : "bg-primary text-primary-foreground ml-auto"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về bữa ăn, calo, thực đơn…"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Đang trả lời…" : "Gửi"}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
