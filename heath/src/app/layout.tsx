import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import AppNav from "./_nav";
import ChatFloating from "@/components/ChatFloating";
import Chatbox from "@/components/chatbox";

export const metadata: Metadata = {
  title: "Nutrition AI",
  description: "Ứng dụng tính dinh dưỡng, lập thực đơn thông minh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <Providers>
          <AppNav />
          <main>{children}</main>
        </Providers>
        <Chatbox />
      </body>
    </html>
  );
}
