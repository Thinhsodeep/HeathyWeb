"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Food = {
  _id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  type?: string;
};
type PlanItem = {
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  qty: number;
};

export default function MealPlannerPage() {
  const { data: session, status } = useSession();

  // if not logged in
  if (status === "loading") return <div className="p-6">Đang tải…</div>;
  if (!session)
    return (
      <div className="container mx-auto max-w-xl py-10">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>💡 Bạn cần đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Đăng nhập để lập thực đơn cá nhân và lưu về tài khoản.
            </p>
            <Button className="rounded-xl" onClick={() => signIn()}>
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return <PlannerBody />;
}

function PlannerBody() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [name, setName] = useState("Thực đơn của tôi");
  const [items, setItems] = useState<PlanItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/foods", { cache: "no-store" });
      setFoods(await res.json());
    })();
  }, []);

  const shown = useMemo(
    () =>
      foods.filter(
        (f) =>
          (type === "all" || f.type === type) &&
          f.name.toLowerCase().includes(q.toLowerCase())
      ),
    [foods, q, type]
  );

  const totals = items.reduce(
    (acc, it) => {
      acc.calories += it.calories * it.qty;
      acc.protein += (it.protein || 0) * it.qty;
      acc.carbs += (it.carbs || 0) * it.qty;
      acc.fat += (it.fat || 0) * it.qty;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  function addItem(f: Food) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.foodId === f._id);
      if (i >= 0) {
        const cp = [...prev];
        cp[i] = { ...cp[i], qty: cp[i].qty + 1 };
        return cp;
      }
      return [
        ...prev,
        {
          foodId: f._id,
          name: f.name,
          calories: f.calories,
          protein: f.protein || 0,
          carbs: f.carbs || 0,
          fat: f.fat || 0,
          qty: 1,
        },
      ];
    });
  }

  async function savePlan() {
    if (!name || items.length === 0) {
      alert("Đặt tên và chọn ít nhất 1 món.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/meal-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        items: items.map((i) => ({ foodId: i.foodId, qty: i.qty })),
      }),
    });
    setSaving(false);
    if (res.ok) {
      alert("Đã lưu thực đơn!");
      setItems([]);
    } else {
      const e = await res.json().catch(() => ({}));
      alert(e?.error || "Không thể lưu");
    }
  }

  return (
    <div className="container mx-auto py-6 grid md:grid-cols-2 gap-4">
      {/* Chọn món */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Chọn món</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm món…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="breakfast">breakfast</SelectItem>
                <SelectItem value="lunch">lunch</SelectItem>
                <SelectItem value="dinner">dinner</SelectItem>
                <SelectItem value="snack">snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-[380px] overflow-y-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead className="text-right">Calo</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((f) => (
                  <TableRow key={f._id}>
                    <TableCell>{f.name}</TableCell>
                    <TableCell className="text-right">{f.calories}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="rounded-xl"
                        onClick={() => addItem(f)}
                      >
                        Thêm
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {shown.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      Không có món
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Kế hoạch hiện tại */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Lập thực đơn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Tên thực đơn</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="rounded-xl border max-h-[380px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead className="text-right">SL</TableHead>
                  <TableHead className="text-right">Calo</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.foodId}>
                    <TableCell className="font-medium">{it.name}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        className="w-16 h-8"
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((x) =>
                              x.foodId === it.foodId
                                ? {
                                    ...x,
                                    qty: Math.max(
                                      1,
                                      Number(e.target.value || 1)
                                    ),
                                  }
                                : x
                            )
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {it.calories * it.qty}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setItems((prev) =>
                            prev.filter((x) => x.foodId !== it.foodId)
                          )
                        }
                      >
                        Xoá
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      Chưa có món
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground">
            Tổng: <b>{totals.calories}</b> kcal • P: <b>{totals.protein}g</b> •
            C: <b>{totals.carbs}g</b> • F: <b>{totals.fat}g</b>
          </div>
          <Button
            className="rounded-xl"
            onClick={savePlan}
            disabled={saving || items.length === 0}
          >
            {saving ? "Đang lưu..." : "Lưu thực đơn"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
