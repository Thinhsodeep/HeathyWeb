"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"; // ✅ đúng package
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const params = useSearchParams();
  const error = params.get("error"); // sẽ là "CredentialsSignin" nếu sai
  const callbackUrl = params.get("callbackUrl") || "/";

  const [email, setEmail] = useState("you@example.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Gọi NextAuth đăng nhập bằng Credentials
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: true, // để NextAuth tự redirect (về callbackUrl) khi thành công
    });

    // Nếu redirect=false, bạn có thể kiểm tra res?.error ở đây
    setLoading(false);
  }

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <form
        onSubmit={onSubmit}
        className="w-[360px] space-y-3 rounded-xl border p-4"
      >
        <div className="text-lg font-semibold">Đăng nhập</div>

        {error && (
          <div className="rounded-md bg-red-50 text-red-700 text-sm p-2">
            Sai email hoặc mật khẩu (Error: {error})
          </div>
        )}

        <div className="grid gap-1.5">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="grid gap-1.5">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </div>
  );
}
