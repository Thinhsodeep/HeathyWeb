"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoMdSend, IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào! Tôi là AI dinh dưỡng. Bạn muốn tôi hỗ trợ gì hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: data.reply || "Xin lỗi, tôi chưa hiểu câu hỏi.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "bot", text: "Lỗi khi gọi API 😢" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Nút mở chat */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 z-50"
      >
        💬
      </motion.button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 w-80 h-96 bg-background border border-border rounded-2xl shadow-lg flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <h3 className="font-semibold text-sm">AI Dinh Dưỡng</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <IoMdClose />
            </button>
          </div>

          {/* Nội dung */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                    m.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <p className="text-xs text-muted-foreground">
                AI đang trả lời...
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-2 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 text-sm px-3 py-2 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90"
            >
              <IoMdSend />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
