// src/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Calculator,
  UtensilsCrossed,
  MessageCircle,
  BarChart3,
  Salad,
  CheckCircle2,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Ảnh nền */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero.jpg"
            alt="Healthy lifestyle"
            fill
            priority
            className="object-cover"
          />

          {/* 🌿 Overlay tone xanh lá nhẹ (health style) */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-b
              from-emerald-100/80 via-lime-100/70 to-background
              dark:from-emerald-900/60 dark:via-emerald-950/50 dark:to-background
              backdrop-blur-[2px]
            "
          />
        </div>

        {/* Nội dung căn giữa */}
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center min-h-[90vh] py-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl flex flex-col items-center gap-5"
          >
            {/* Logo / Badge */}
            <Badge className="rounded-full mb-2 px-4 py-1 text-sm bg-emerald-600 text-white shadow">
              HealthyFit AI
            </Badge>

            {/* Tiêu đề */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground drop-shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:text-white">
              Dinh dưỡng Thông minh, Sống Khỏe Mỗi Ngày.
            </h1>

            {/* Mô tả */}
            <p className="mt-2 text-base md:text-lg text-foreground/80 dark:text-white/90 max-w-2xl">
              HealthyFit AI giúp bạn đạt mục tiêu giảm cân bằng công nghệ tiên
              tiến. Tính toán chỉ số <span className="font-semibold">TDEE</span>
              , nhận gợi ý thực phẩm thông minh và trò chuyện cùng trợ lý dinh
              dưỡng AI.
            </p>

            {/* Nút hành động */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Link href="/calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  Tính Chỉ Số TDEE Của Bạn
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl border-emerald-300 text-foreground bg-white/80 hover:bg-emerald-50 dark:bg-background dark:border-emerald-800 dark:hover:bg-emerald-900/30"
              >
                <Link href="#features">Khám Phá Tính Năng</Link>
              </Button>
            </div>

            {/* Highlights */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-3 text-foreground/80 dark:text-white/90">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Kiến Tạo Vóc Dáng Ước Mơ Cùng AI
              </span>
              <Separator
                className="hidden sm:block h-4"
                orientation="vertical"
              />
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Kế Hoạch Giảm Cân Cá Nhân Hóa
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-4 py-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold">Tính năng nổi bật</h2>
          <p className="text-muted-foreground mt-2">
            Mọi thứ bạn cần để bắt đầu hành trình sống khỏe – gọn nhẹ, trực quan
            và hiệu quả.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl bg-card border-emerald-200/60 dark:border-emerald-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Tính Toán Năng Lượng Chính Xác
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Xác định TDEE dựa trên chiều cao, cân nặng, tuổi, giới tính và mức
              độ hoạt động. Nền tảng cho kế hoạch giảm cân hiệu quả.
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card border-emerald-200/60 dark:border-emerald-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UtensilsCrossed className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Thực Đơn Lý Tưởng Cho Bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Gợi ý thực phẩm phù hợp mục tiêu và sở thích ăn uống. Đầy đủ dinh
              dưỡng, không nhàm chán.
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-card border-emerald-200/60 dark:border-emerald-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Trợ Lý Dinh Dưỡng AI
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Hỏi đáp nhanh về khẩu phần, macro, mẹo ăn uống – 24/7. Luôn sẵn
              sàng hỗ trợ bạn.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase" className="container mx-auto px-4 py-6">
        <Card className="rounded-2xl overflow-hidden bg-card border-emerald-200/70 dark:border-emerald-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Trải Nghiệm HealthyFit Ngay Hôm Nay!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Mockup UI */}
              <div className="relative rounded-xl border bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <Image
                    src="/mockup.png"
                    alt="HealthyFit AI mockup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div>
                <Tabs defaultValue="dashboard" className="w-full">
                  <TabsList className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                    <TabsTrigger
                      value="dashboard"
                      className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger
                      value="meal"
                      className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Meal Plan
                    </TabsTrigger>
                    <TabsTrigger
                      value="food"
                      className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Food Library
                    </TabsTrigger>
                    <TabsTrigger
                      value="chat"
                      className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Chatbot
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="mt-4">
                    <Card className="rounded-xl bg-card border-emerald-200/60 dark:border-emerald-900/40">
                      <CardHeader>
                        <CardTitle>Tổng quan chỉ số & mục tiêu</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Theo dõi TDEE, tiến độ cân nặng, macro mỗi ngày và gợi ý
                        điều chỉnh thông minh.
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="meal" className="mt-4">
                    <Card className="rounded-xl bg-card border-emerald-200/60 dark:border-emerald-900/40">
                      <CardHeader>
                        <CardTitle>Thực đơn cá nhân hóa</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Gợi ý bữa sáng, trưa, tối và snack theo mục tiêu calo.
                        Có thể thay thế linh hoạt.
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="food" className="mt-4">
                    <Card className="rounded-xl bg-card border-emerald-200/60 dark:border-emerald-900/40">
                      <CardHeader>
                        <CardTitle>Thư viện thực phẩm</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Tra cứu nhanh calo & macro của hàng nghìn thực phẩm phổ
                        biến tại Việt Nam.
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="chat" className="mt-4">
                    <Card className="rounded-xl bg-card border-emerald-200/60 dark:border-emerald-900/40">
                      <CardHeader>
                        <CardTitle>Trợ lý chat AI</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Đặt câu hỏi về dinh dưỡng, kế hoạch ăn uống, hoặc mẹo
                        tập luyện – AI phản hồi tức thì.
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="mt-5 flex gap-3">
                  <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href="/register">Dùng thử miễn phí!</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-emerald-300 text-foreground hover:bg-emerald-50 dark:border-emerald-900/40 dark:hover:bg-emerald-950/30"
                  >
                    <Link href="/calculator">Tính TDEE ngay</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="container mx-auto px-4 py-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold">
            Hàng Nghìn Người Đã Thành Công Cùng HealthyFit!
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Ngọc Anh",
              text: "Sau 8 tuần dùng HealthyFit AI, mình giảm 5kg. Thực đơn dễ làm, không bị đói.",
            },
            {
              name: "Minh Long",
              text: "Điểm thích nhất là TDEE & macro được tính sẵn. Chỉ cần theo đúng là cân nặng đi xuống đều.",
            },
            {
              name: "Hải Yến",
              text: "Chatbot hỗ trợ rất nhanh, gợi ý thay thế món ăn phù hợp khi bận rộn.",
            },
          ].map((t, i) => (
            <Card
              key={i}
              className="rounded-2xl bg-card border-emerald-200/60 dark:border-emerald-900/40"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <Avatar className="h-7 w-7 ring-2 ring-emerald-300/50 dark:ring-emerald-900/40">
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 flex items-center justify-center">
                        <Salad className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    {t.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Star className="h-4 w-4 fill-emerald-500 dark:fill-emerald-400" />
                    5.0
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                “{t.text}”
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button
            asChild
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link href="/stories">Xem thêm câu chuyện thành công</Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Salad className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">HealthyFit AI</span>
            <Badge className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              Beta
            </Badge>
          </div>

          <div className="text-muted-foreground">
            © {new Date().getFullYear()} – Sống khỏe thông minh mỗi ngày
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Liên hệ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
