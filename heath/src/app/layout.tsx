import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import AppNav from "./_nav"; // thanh menu bạn đã đặt ở app/_nav.tsx

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
    <html lang="vi">
      <body className="bg-background text-foreground min-h-screen">
        <Providers>
          {/* Nav hiển thị ở mọi trang */}
          <AppNav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
