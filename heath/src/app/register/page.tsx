"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      alert("Đăng ký thành công. Vui lòng đăng nhập!");
      router.push("/login");
    } else {
      const e = await res.json().catch(() => ({}));
      alert(e?.error || "Đăng ký thất bại");
    }
  }

  return (
    <div className="container mx-auto max-w-md py-10">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Đăng ký</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div>
              <Label>Họ tên</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Mật khẩu</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full rounded-xl" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
            </Button>
          </form>
          <div className="text-sm text-muted-foreground mt-3">
            Đã có tài khoản?{" "}
            <a className="underline" href="/login">
              Đăng nhập
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
