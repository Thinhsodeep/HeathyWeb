"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Salad, Menu, Settings } from "lucide-react";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/calculator", label: "Tính chỉ số" },
  { href: "/meal-planner", label: "Lập thực đơn" },
  { href: "/foods", label: "Thực phẩm" },
  { href: "/recipes", label: "Công thức" },
];

export default function AppNav() {
  const pathname = usePathname();

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
            className="rounded-xl"
            asChild
          >
            <Link href={it.href}>{it.label}</Link>
          </Button>
        );
      })}
    </nav>
  );

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex items-center gap-2 mb-4">
          <Salad className="h-5 w-5" />
          <span className="font-semibold">Nutrition AI</span>
          <Badge variant="secondary" className="ml-1">
            Beta
          </Badge>
        </div>
        <div className="grid gap-1">
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

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <MobileNav />
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <Salad className="h-5 w-5" />
          Nutrition AI
          <Badge variant="secondary" className="ml-1">
            Beta
          </Badge>
        </div>
        <DesktopNav />
        <div className="ml-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
