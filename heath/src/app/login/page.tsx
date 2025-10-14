"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("you@example.com");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // helper lấy message an toàn
    const getErrMsg = (u: unknown) =>
      u instanceof Error ? u.message : "Có lỗi xảy ra";

    try {
      if (mode === "login") {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl,
        });
        if (res?.error) {
          alert(res.error || "Đăng nhập thất bại");
        } else {
          router.push(callbackUrl);
        }
      } else {
        const r = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!r.ok) {
          const j: { error?: string } = await r.json().catch(() => ({}));
          throw new Error(j?.error || "Đăng ký thất bại");
        }

        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl,
        });
        if (res?.error) {
          alert(res.error || "Đăng nhập sau đăng ký thất bại");
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (err: unknown) {
      alert(getErrMsg(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle>
            {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "register" && (
              <div className="grid gap-1.5">
                <Label htmlFor="name">Họ tên</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : mode === "login"
                ? "Đăng nhập"
                : "Tạo tài khoản"}
            </Button>
          </form>

          <Separator className="my-4" />
          <div className="text-sm text-center">
            {mode === "login" ? (
              <>
                Chưa có tài khoản?{" "}
                <button
                  className="underline font-medium"
                  onClick={() => setMode("register")}
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{" "}
                <button
                  className="underline font-medium"
                  onClick={() => setMode("login")}
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
