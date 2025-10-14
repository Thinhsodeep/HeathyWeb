"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calculator } from "lucide-react";

function calcBMR(kg: number, cm: number, age: number, sex: "male" | "female") {
  if (!kg || !cm || !age) return 0;
  return Math.round(
    10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161)
  );
}
function calcBMI(kg: number, cm: number) {
  const m = cm / 100;
  if (!kg || !cm) return { value: 0, label: "—" } as const;
  const bmi = +(kg / (m * m)).toFixed(1);
  return {
    value: bmi,
    label:
      bmi < 18.5
        ? "Thiếu cân"
        : bmi < 23
        ? "Bình thường"
        : bmi < 27.5
        ? "Thừa cân"
        : "Béo phì",
  } as const;
}
function activityFactor(a: string) {
  return a === "light"
    ? 1.375
    : a === "moderate"
    ? 1.55
    : a === "active"
    ? 1.725
    : a === "very"
    ? 1.9
    : 1.2;
}
function targetCalories(t: number, g: string) {
  if (!t) return 0;
  return Math.round(g === "lose" ? t * 0.85 : g === "gain" ? t * 1.15 : t);
}
function macroGrams(cal: number, g: string) {
  const map =
    g === "lose"
      ? { p: 0.35, c: 0.35, f: 0.3 }
      : g === "gain"
      ? { p: 0.25, c: 0.5, f: 0.25 }
      : { p: 0.3, c: 0.4, f: 0.3 };
  return {
    protein: Math.round((cal * map.p) / 4),
    carbs: Math.round((cal * map.c) / 4),
    fat: Math.round((cal * map.f) / 9),
  } as const;
}

export default function CalculatorPage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(24);
  const [h, setH] = useState(170);
  const [w, setW] = useState(70);
  const [act, setAct] = useState("light");
  const [goal, setGoal] = useState("lose");

  const { value: bmi, label: bmiLabel } = useMemo(() => calcBMI(w, h), [w, h]);
  const bmr = useMemo(() => calcBMR(w, h, age, sex), [w, h, age, sex]);
  const tdee = useMemo(() => Math.round(bmr * activityFactor(act)), [bmr, act]);
  const cal = useMemo(() => targetCalories(tdee, goal), [tdee, goal]);
  const macros = useMemo(() => macroGrams(cal, goal), [cal, goal]);

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-2 gap-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>
            <Calculator className="h-5 w-5 mr-2 inline" /> Bộ tính chỉ số
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Giới tính</Label>
            <RadioGroup
              defaultValue={sex}
              onValueChange={(v) => setSex(v as "male" | "female")}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Nam</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Nữ</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Tuổi</Label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(+e.target.value)}
              />
            </div>
            <div>
              <Label>Chiều cao (cm)</Label>
              <Input
                type="number"
                value={h}
                onChange={(e) => setH(+e.target.value)}
              />
            </div>
            <div>
              <Label>Cân nặng (kg)</Label>
              <Input
                type="number"
                value={w}
                onChange={(e) => setW(+e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <Label>Mức vận động</Label>
            <Select value={act} onValueChange={setAct}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Ít vận động</SelectItem>
                <SelectItem value="light">Nhẹ</SelectItem>
                <SelectItem value="moderate">Vừa</SelectItem>
                <SelectItem value="active">Nhiều</SelectItem>
                <SelectItem value="very">Rất nhiều</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Mục tiêu</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Giảm cân</SelectItem>
                <SelectItem value="maintain">Giữ cân</SelectItem>
                <SelectItem value="gain">Tăng cơ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="rounded-xl w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Tính lại
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Kết quả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">BMI</div>
              <div className="text-2xl font-semibold">{bmi || "—"}</div>
              <Badge
                variant="outline"
                className="mt-1 rounded-xl border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
              >
                {bmiLabel}
              </Badge>
            </div>
            <div className="border rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">BMR</div>
              <div className="text-2xl font-semibold">{bmr || "—"} kcal</div>
            </div>
            <div className="border rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">TDEE</div>
              <div className="text-2xl font-semibold">{tdee || "—"} kcal</div>
            </div>
            <div className="border rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">Mục tiêu</div>
              <div className="text-2xl font-semibold">{cal || "—"} kcal</div>
              <Badge
                variant="secondary"
                className="mt-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                {goal === "lose" ? "Giảm" : goal === "gain" ? "Tăng" : "Giữ"}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-3">
            <div className="border rounded-2xl p-3">
              <div className="text-xs">Protein</div>
              <div className="text-lg font-semibold">{macros.protein}g</div>
              <Progress
                value={Math.min(100, macros.protein / 2)}
                className="h-2 mt-1 bg-emerald-100 dark:bg-emerald-950/30 [&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-400"
              />
            </div>
            <div className="border rounded-2xl p-3">
              <div className="text-xs">Carbs</div>
              <div className="text-lg font-semibold">{macros.carbs}g</div>
              <Progress
                value={Math.min(100, macros.carbs / 3)}
                className="h-2 mt-1 bg-emerald-100 dark:bg-emerald-950/30 [&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-400"
              />
            </div>
            <div className="border rounded-2xl p-3">
              <div className="text-xs">Fat</div>
              <div className="text-lg font-semibold">{macros.fat}g</div>
              <Progress
                value={Math.min(100, macros.fat)}
                className="h-2 mt-1 bg-emerald-100 dark:bg-emerald-950/30 [&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
