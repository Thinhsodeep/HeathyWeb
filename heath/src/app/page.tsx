"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-background text-foreground">
      {/* ===== Header ===== */}
      <header className="w-full border-b">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight">Thinh Store</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost">Sản phẩm</Button>
            <Button variant="ghost">Về chúng tôi</Button>
            <Button variant="outline">Đăng nhập</Button>
          </div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="mx-auto w-full max-w-6xl px-6 py-10 grid gap-12">
        {/* --- Hero --- */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Mặc đẹp mỗi ngày ✨
            </h1>
            <p className="text-muted-foreground">
              Bộ sưu tập tối giản, chất liệu thoáng mát – phù hợp đi học, đi làm
              và đi chơi.
            </p>

            <div className="flex w-full max-w-md items-center gap-2">
              <Input type="email" placeholder="Nhập email để nhận ưu đãi" />
              <Button type="submit">Đăng ký</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              *Bạn có thể huỷ nhận email bất cứ lúc nào.
            </p>
          </div>

          <div className="relative aspect-[4/3] w-full"></div>
        </section>

        {/* --- Featured products (demo) --- */}
        <section className="grid gap-6">
          <h2 className="text-xl font-semibold">Sản phẩm nổi bật</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="rounded-xl border overflow-hidden">
                <div className="relative aspect-[4/3]"></div>
                <div className="p-4 grid gap-2">
                  <h3 className="font-medium">Áo thun tối giản #{i}</h3>
                  <p className="text-sm text-muted-foreground">
                    Vải cotton thoáng mát, form regular.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold">199.000đ</span>
                    <Button variant="outline" size="sm">
                      Thêm giỏ
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FieldSeparator />

        {/* --- Contact form (dùng Field* components) --- */}
        <section className="grid gap-4">
          <FieldTitle>Liên hệ nhanh</FieldTitle>
          <FieldDescription>
            Có câu hỏi hoặc cần hỗ trợ size? Điền thông tin bên dưới, chúng mình
            sẽ phản hồi sớm nhất.
          </FieldDescription>

          <FieldSet>
            <FieldLegend>Thông tin của bạn</FieldLegend>

            <FieldGroup>
              <Field>
                <FieldLabel>Họ và tên</FieldLabel>
                <FieldContent>
                  <Input placeholder="Nguyễn Văn A" />
                </FieldContent>
                <FieldError /> {/* chỗ hiển thị lỗi (nếu có) */}
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <Input type="email" placeholder="email@domain.com" />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel>Số điện thoại (tuỳ chọn)</FieldLabel>
                <FieldContent>
                  <Input type="tel" placeholder="09xx xxx xxx" />
                </FieldContent>
              </Field>
            </FieldGroup>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit">Gửi liên hệ</Button>
              <Button variant="outline" type="button">
                Huỷ
              </Button>
            </div>
          </FieldSet>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="w-full border-t">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Thinh Store</span>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">
              Chính sách
            </a>
            <a className="hover:underline" href="#">
              Điều khoản
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
