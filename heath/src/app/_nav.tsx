"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Salad, Menu, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ---------------------------- Navbar ---------------------------- */

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/calculator", label: "Tính chỉ số" },
  { href: "/meal-planner", label: "Lập thực đơn" },
  { href: "/foods", label: "Thực phẩm" },
  { href: "/recipes", label: "Công thức" },
];

export default function AppNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "";
  const { data: session } = useSession();

  /* ----- Desktop Navigation ----- */
  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-1 mx-4">
      {NAV.map((it) => {
        const active =
          pathname === it.href ||
          (it.href !== "/" && pathname.startsWith(it.href));

        return (
          <Button
            key={it.href}
            variant={active ? "default" : "ghost"}
            className="rounded-xl font-medium transition-colors"
            asChild
          >
            <Link href={it.href}>{it.label}</Link>
          </Button>
        );
      })}
    </nav>
  );

  /* ----- Mobile Navigation ----- */
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Salad className="h-5 w-5" />
            Nutrition AI
            <Badge variant="secondary" className="ml-1">
              Beta
            </Badge>
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-1 mt-4">
          {NAV.map((it) => (
            <Button
              key={it.href}
              variant="ghost"
              className="justify-start rounded-xl"
              asChild
            >
              <Link href={it.href}>{it.label}</Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  /* ----- Main Layout ----- */
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-md bg-gradient-to-b from-emerald-100/80 via-lime-100/60 to-background dark:from-emerald-900/60 dark:via-emerald-950/40 dark:to-background transition-colors">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        {/* Mobile Nav giữ nguyên */}
        <MobileNav />

        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold tracking-tight text-lg">
          <Salad className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-foreground">HealthyFit</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 mx-4">
          {NAV.map((it) => {
            const active =
              pathname === it.href ||
              (it.href !== "/" && pathname.startsWith(it.href));

            return (
              <Button
                key={it.href}
                variant={active ? "default" : "ghost"}
                className={`rounded-xl font-medium transition-colors ${
                  active
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "hover:bg-emerald-100 dark:hover:bg-emerald-950/40"
                }`}
                asChild
              >
                <Link href={it.href}>{it.label}</Link>
              </Button>
            );
          })}
        </nav>

        {/* Bên phải */}
        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">
                Xin chào, {session.user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Link href="/register">Đăng ký</Link>
              </Button>
            </>
          )}

          <ThemeToggle />

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </Button>
        </div>
      </div>
    </header>
  );
}
