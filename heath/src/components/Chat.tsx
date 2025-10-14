"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { id: string; role: "user" | "assistant"; content: string };

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Lỗi không xác định";
  }
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "sys1", role: "assistant", content: "Xin chào! Bạn cần gì?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const nextMsgs: Msg[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content },
      { id: "assistant-temp", role: "assistant", content: "" },
    ];
    setMessages(nextMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: nextMsgs.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Chat API lỗi");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        // cập nhật tin nhắn assistant cuối cùng
        setMessages((prev) => {
          const clone = [...prev];
          const idx = clone.findIndex((m) => m.id === "assistant-temp");
          if (idx !== -1) clone[idx] = { ...clone[idx], content: acc };
          return clone;
        });
      }

      // chốt id cố định cho message assistant
      setMessages((prev) => {
        const clone = [...prev];
        const idx = clone.findIndex((m) => m.id === "assistant-temp");
        if (idx !== -1) clone[idx].id = crypto.randomUUID();
        return clone;
      });
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Có lỗi xảy ra: ${getErrorMessage(err)}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[80vh] flex flex-col border rounded-xl p-4 gap-3">
      <div className="flex-1 overflow-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap rounded-lg p-3 ${
              m.role === "user" ? "bg-gray-100" : "bg-gray-50"
            }`}
          >
            <b>{m.role === "user" ? "Bạn" : "AI"}</b>
            <div>{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Nhập câu hỏi…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg border"
          disabled={loading}
        >
          {loading ? "Đang trả lời…" : "Gửi"}
        </button>
      </form>
    </div>
  );
}
