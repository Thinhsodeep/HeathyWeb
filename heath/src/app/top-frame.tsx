"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Salad, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TopFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Ẩn topbar/footer ở trang đăng nhập (và các route auth nếu muốn)
  const hideChrome = pathname.startsWith("/login");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {!hideChrome && (
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <Salad className="h-5 w-5" />
              <Link href="/">Nutrition AI</Link>
              <Badge variant="secondary" className="ml-1">
                Beta
              </Badge>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {session?.user?.name && (
                <Badge className="rounded-xl" variant="outline">
                  {session.user.name}
                </Badge>
              )}

              <Button
                variant="outline"
                size="icon"
                className="rounded-xl"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {session ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Đăng xuất
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              )}
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>

      {!hideChrome && (
        <footer className="py-8 border-t">
          <div className="container mx-auto px-4 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="h-4 w-4" /> Nutrition AI
            </div>
            <div>© {new Date().getFullYear()} – Đồ án Web Dinh Dưỡng</div>
          </div>
        </footer>
      )}
    </div>
  );
}
