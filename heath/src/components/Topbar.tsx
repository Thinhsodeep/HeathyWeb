"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Salad, Menu, Settings, MessageCircle } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Salad className="h-5 w-5" />
          Nutrition AI
          <Badge variant="secondary" className="ml-1">
            Beta
          </Badge>
        </Link>

        {/* NAV – menu tính năng */}
        <nav className="ml-6 hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/calculator">Tính toán</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/meal-planner">Thực đơn</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/foods">Món ăn</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/recipes">Công thức</Link>
          </Button>
        </nav>

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
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}

          <Button size="icon" className="rounded-2xl" aria-label="Chat">
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
