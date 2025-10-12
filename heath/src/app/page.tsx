"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RCTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Brain,
  Salad,
  LineChart as LineChartIcon,
  MessageCircle,
  Sparkles,
  User,
  Calculator,
  Send,
  Menu,
  LogIn,
  Settings,
} from "lucide-react";

// ---------- Utils ----------
function calcBMI(kg: number, cm: number) {
  const m = cm / 100;
  if (!kg || !cm) return { value: 0, label: "—" } as const;
  const bmi = +(kg / (m * m)).toFixed(1);
  let label = "Bình thường";
  if (bmi < 18.5) label = "Thiếu cân";
  else if (bmi < 23) label = "Bình thường"; // ngưỡng châu Á
  else if (bmi < 27.5) label = "Thừa cân";
  else label = "Béo phì";
  return { value: bmi, label } as const;
}

function calcBMR(kg: number, cm: number, age: number, sex: "male" | "female") {
  if (!kg || !cm || !age || !sex) return 0;
  return Math.round(
    10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161)
  );
}

function activityFactor(level: string) {
  switch (level) {
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "active":
      return 1.725;
    case "very":
      return 1.9;
    default:
      return 1.2;
  }
}

function targetCalories(tdee: number, goal: string) {
  if (!tdee) return 0;
  if (goal === "lose") return Math.round(tdee * 0.85);
  if (goal === "gain") return Math.round(tdee * 1.15);
  return Math.round(tdee);
}

function macroSplit(goal: string) {
  if (goal === "lose") return { p: 0.35, c: 0.35, f: 0.3 };
  if (goal === "gain") return { p: 0.25, c: 0.5, f: 0.25 };
  return { p: 0.3, c: 0.4, f: 0.3 };
}

function macroGrams(cal: number, goal: string) {
  const { p, c, f } = macroSplit(goal);
  return {
    protein: Math.round((cal * p) / 4),
    carbs: Math.round((cal * c) / 4),
    fat: Math.round((cal * f) / 9),
  } as const;
}

const mockWeightData = [
  { date: "Tuần 1", weight: 72, calories: 2200 },
  { date: "Tuần 2", weight: 71.6, calories: 2100 },
  { date: "Tuần 3", weight: 71.2, calories: 2050 },
  { date: "Tuần 4", weight: 70.9, calories: 2000 },
];

const mealsCatalog = {
  breakfast: [
    { name: "Yến mạch + sữa chua Hy Lạp + chuối", calories: 400 },
    { name: "Bánh mì ngũ cốc + trứng ốp la + salad", calories: 420 },
  ],
  lunch: [
    { name: "Cơm gạo lứt + ức gà áp chảo + rau củ", calories: 550 },
    { name: "Bún thịt nạc + rau sống", calories: 520 },
  ],
  dinner: [
    { name: "Cá hồi áp chảo + khoai lang + súp lơ", calories: 600 },
    { name: "Đậu phụ sốt cà + miến lứt + rau xanh", calories: 520 },
  ],
  snack: [
    { name: "Hạnh nhân 30g", calories: 170 },
    { name: "Táo + bơ đậu phộng", calories: 220 },
  ],
};

function suggestMealPlan(calTarget: number) {
  if (!calTarget) return [] as { time: string; item: string; cal: number }[];
  const split = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.3,
    snack: 0.1,
  } as const;
  return (Object.keys(split) as (keyof typeof split)[]).map((k) => {
    const bucket = mealsCatalog[k];
    const pick = bucket[Math.floor(Math.random() * bucket.length)];
    return { time: k, item: pick.name, cal: Math.round(calTarget * split[k]) };
  });
}

// ---------- Chat Sheet ----------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function ChatSheet({ onAsk }: { onAsk: (q: string) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      role: "assistant",
      content:
        "Xin chào! Mình là AI tư vấn dinh dưỡng. Bạn muốn đạt mục tiêu gì?",
    },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-2xl shadow"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-0 flex flex-col"
      >
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" /> Tư vấn dinh dưỡng AI
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] md:max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow ${
                m.role === "assistant"
                  ? "bg-background"
                  : "bg-primary text-primary-foreground ml-auto"
              }`}
            >
              {m.content}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form
          className="p-3 border-t flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const q = input.trim();
            if (!q) return;
            setMessages((prev) => [
              ...prev,
              { id: crypto.randomUUID(), role: "user", content: q },
            ]);
            setInput("");
            onAsk(q);
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content:
                    "Mẹo: Ưu tiên thực phẩm giàu đạm (ức gà, cá, đậu), rau xanh và ngũ cốc nguyên hạt.",
                },
              ]);
            }, 400);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về bữa ăn, calo, thực đơn…"
          />
          <Button type="submit" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ---------- Main Page ----------
export default function NutritionAIApp() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number>(24);
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [activity, setActivity] = useState<string>("light");
  const [goal, setGoal] = useState<string>("lose");

  const { value: bmi, label: bmiLabel } = useMemo(
    () => calcBMI(weight, height),
    [weight, height]
  );
  const bmr = useMemo(
    () => calcBMR(weight, height, age, sex),
    [weight, height, age, sex]
  );
  const tdee = useMemo(
    () => Math.round(bmr * activityFactor(activity)),
    [bmr, activity]
  );
  const cals = useMemo(() => targetCalories(tdee, goal), [tdee, goal]);
  const macros = useMemo(() => macroGrams(cals, goal), [cals, goal]);
  const [plan, setPlan] = useState(() => suggestMealPlan(cals));

  useEffect(() => {
    setPlan(suggestMealPlan(cals));
  }, [cals, goal]);

  const LoginDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl">
          <LogIn className="h-4 w-4 mr-2" /> Đăng nhập
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Đăng nhập</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input placeholder="you@example.com" />
          </div>
          <div className="grid gap-1.5">
            <Label>Mật khẩu</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full rounded-xl">Tiếp tục</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
        {/* Topbar */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <Salad className="h-5 w-5" /> Nutrition AI
              <Badge variant="secondary" className="ml-1">
                Beta
              </Badge>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <LoginDialog />
              <ChatSheet
                onAsk={() => {
                  /* hook to backend */
                }}
              />
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {/* Left: inputs */}
            <Card className="md:col-span-1 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-1.5">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    defaultValue={sex}
                    onValueChange={(v) => setSex(v as "male" | "female")}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Nữ</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Tuổi</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(+e.target.value)}
                      min={5}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Chiều cao (cm)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(+e.target.value)}
                      min={80}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Cân nặng (kg)</Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(+e.target.value)}
                      min={20}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label>Mức vận động</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Ít vận động</SelectItem>
                      <SelectItem value="light">Nhẹ (1–3 buổi/tuần)</SelectItem>
                      <SelectItem value="moderate">
                        Vừa (3–5 buổi/tuần)
                      </SelectItem>
                      <SelectItem value="active">
                        Nhiều (6–7 buổi/tuần)
                      </SelectItem>
                      <SelectItem value="very">
                        Rất nhiều (2 lần/ngày)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label>Mục tiêu</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Giảm cân</SelectItem>
                      <SelectItem value="maintain">Giữ cân</SelectItem>
                      <SelectItem value="gain">Tăng cơ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full rounded-xl" variant="default">
                  <Calculator className="h-4 w-4 mr-2" /> Tính toán
                </Button>
              </CardContent>
            </Card>

            {/* Middle: results */}
            <Card className="md:col-span-1 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" /> Kết quả
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs text-muted-foreground">BMI</div>
                    <div className="text-2xl font-semibold">{bmi || "—"}</div>
                    <Badge variant="outline" className="mt-1 rounded-xl">
                      {bmiLabel}
                    </Badge>
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs text-muted-foreground">BMR</div>
                    <div className="text-2xl font-semibold">
                      {bmr || "—"} kcal
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Năng lượng cơ bản
                    </div>
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs text-muted-foreground">TDEE</div>
                    <div className="text-2xl font-semibold">
                      {tdee || "—"} kcal
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Nhu cầu duy trì
                    </div>
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs text-muted-foreground">
                      Mục tiêu/ngày
                    </div>
                    <div className="text-2xl font-semibold">
                      {cals || "—"} kcal
                    </div>
                    <Badge variant="secondary" className="mt-1 rounded-xl">
                      {goal === "lose"
                        ? "Giảm"
                        : goal === "gain"
                        ? "Tăng"
                        : "Giữ"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs">Protein</div>
                    <div className="text-lg font-semibold">
                      {macros.protein}g
                    </div>
                    <Progress
                      value={Math.min(100, (macros.protein / 200) * 100)}
                      className="h-2 mt-1"
                    />
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs">Carbs</div>
                    <div className="text-lg font-semibold">{macros.carbs}g</div>
                    <Progress
                      value={Math.min(100, (macros.carbs / 300) * 100)}
                      className="h-2 mt-1"
                    />
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs">Fat</div>
                    <div className="text-lg font-semibold">{macros.fat}g</div>
                    <Progress
                      value={Math.min(100, (macros.fat / 100) * 100)}
                      className="h-2 mt-1"
                    />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  * Tỉ lệ macro tự động theo mục tiêu, có thể tùy chỉnh trong
                  phần Cài đặt.
                </div>
              </CardContent>
            </Card>

            {/* Right: chart */}
            <Card className="md:col-span-1 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" /> Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockWeightData}
                    margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RCTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      name="Cân nặng (kg)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="calories"
                      name="Calo (kcal)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Planner & Chat */}
        <section className="container mx-auto px-4 pb-10">
          <Tabs defaultValue="planner" className="w-full">
            <TabsList className="rounded-2xl">
              <TabsTrigger value="planner" className="rounded-xl">
                🍱 Thực đơn gợi ý
              </TabsTrigger>
              <TabsTrigger value="education" className="rounded-xl">
                📚 Kiến thức
              </TabsTrigger>
            </TabsList>

            <TabsContent value="planner" className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Thực đơn theo mục tiêu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {plan.map((p) => (
                      <div key={p.time} className="rounded-2xl border p-3">
                        <div className="text-xs uppercase text-muted-foreground">
                          {p.time}
                        </div>
                        <div className="font-medium mt-1">{p.item}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ~{p.cal} kcal
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => setPlan(suggestMealPlan(cals))}
                    >
                      Gợi ý lại
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="rounded-xl">
                          Xuất PDF (demo)
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Hook vào tính năng xuất báo cáo khi làm đồ án
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Góc kiến thức nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    • Đặt mục tiêu 0.7–1.6g protein/kg cơ thể/ngày tùy mức hoạt
                    động.
                  </p>
                  <p>
                    • Ưu tiên thực phẩm nguyên chất, hạn chế đồ uống có đường.
                  </p>
                  <p>
                    • Ngủ đủ 7–8h và uống đủ nước giúp tối ưu hoá trao đổi chất.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t">
          <div className="container mx-auto px-4 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="h-4 w-4" /> Nutrition AI • Demo giao diện
              (shadcn/ui)
            </div>
            <div>© {new Date().getFullYear()} – Đồ án Web Dinh Dưỡng</div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
