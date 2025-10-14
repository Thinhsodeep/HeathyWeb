// src/app/foods/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Pencil } from "lucide-react";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type Food = {
  _id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  type?: MealType;
};

const TYPE_OPTIONS: readonly MealType[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
] as const;

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<MealType | "all">("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/foods", { cache: "no-store" });
      const data: Food[] = await res.json();
      setFoods(data);
    })();
  }, []);

  const filtered = useMemo(
    () =>
      foods.filter((f) => {
        const matchedType =
          type === "all" ? true : (f.type ?? "breakfast") === type;
        const matchedQ = f.name.toLowerCase().includes(q.toLowerCase());
        return matchedType && matchedQ;
      }),
    [foods, q, type]
  );

  const total = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  // ======= Create dialog =======
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    calories: number | string;
    protein: number | string;
    carbs: number | string;
    fat: number | string;
    type: MealType;
  }>({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    type: "breakfast",
  });

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function createFood() {
    if (!form.name || Number(form.calories) <= 0) {
      alert("Vui lòng nhập Tên và Calo > 0");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          calories: Number(form.calories) || 0,
          protein: Number(form.protein) || 0,
          carbs: Number(form.carbs) || 0,
          fat: Number(form.fat) || 0,
          type: form.type,
        }),
      });
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({})))?.error || "Không thể tạo món"
        );
      const created: Food = await res.json();
      setFoods((prev) => [...prev, created]);
      setOpen(false);
      setForm({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        type: "breakfast",
      });
      setPage(1);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  // ======= Edit dialog =======
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Food | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    calories: number | string;
    protein: number | string;
    carbs: number | string;
    fat: number | string;
    type: MealType;
  }>({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    type: "breakfast",
  });

  function startEdit(item: Food) {
    setEditing(item);
    setEditForm({
      name: item.name,
      calories: item.calories,
      protein: item.protein ?? 0,
      carbs: item.carbs ?? 0,
      fat: item.fat ?? 0,
      type: item.type ?? "breakfast",
    });
    setOpenEdit(true);
  }

  function updateEdit<K extends keyof typeof editForm>(
    key: K,
    val: (typeof editForm)[K]
  ) {
    setEditForm((f) => ({ ...f, [key]: val }));
  }

  async function saveEdit() {
    if (!editing) return;
    if (!editForm.name || Number(editForm.calories) <= 0) {
      alert("Vui lòng nhập Tên và Calo > 0");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/foods/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          calories: Number(editForm.calories) || 0,
          protein: Number(editForm.protein) || 0,
          carbs: Number(editForm.carbs) || 0,
          fat: Number(editForm.fat) || 0,
          type: editForm.type,
        }),
      });
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({})))?.error || "Không thể cập nhật"
        );
      const updated: Food = await res.json();
      setFoods((prev) =>
        prev.map((f) => (f._id === updated._id ? updated : f))
      );
      setOpenEdit(false);
      setEditing(null);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUpdating(false);
    }
  }

  async function deleteFood(id: string) {
    if (!confirm("Xóa món này?")) return;
    const keep = foods;
    setFoods((prev) => prev.filter((f) => f._id !== id));
    const res = await fetch(`/api/foods/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Xóa thất bại");
      setFoods(keep);
    }
  }

  return (
    <div className="space-y-4 bg-gradient-to-b from-emerald-50/60 via-lime-50/40 to-background dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-background rounded-3xl p-4 md:p-6">
      {/* Toolbar */}
      <Card className="rounded-2xl border-emerald-200/60 dark:border-emerald-900/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-emerald-700 dark:text-emerald-400">
              📦 Cơ sở dữ liệu thực phẩm
            </span>

            {/* Thêm món */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-4 w-4 mr-2" /> Thêm món
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[560px] rounded-2xl border-emerald-200 dark:border-emerald-800">
                <DialogHeader>
                  <DialogTitle className="text-emerald-700 dark:text-emerald-400">
                    Thêm thực phẩm
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label>Tên món *</Label>
                    <Input
                      className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Calo *</Label>
                    <Input
                      type="number"
                      className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                      value={form.calories}
                      onChange={(e) => update("calories", e.target.value)}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                      value={form.protein}
                      onChange={(e) => update("protein", e.target.value)}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                      value={form.carbs}
                      onChange={(e) => update("carbs", e.target.value)}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                      value={form.fat}
                      onChange={(e) => update("fat", e.target.value)}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label>Loại bữa</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => update("type", v as MealType)}
                    >
                      <SelectTrigger className="rounded-xl border-emerald-200 dark:border-emerald-800">
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="rounded-xl border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
                    onClick={() => setOpen(false)}
                  >
                    Huỷ
                  </Button>
                  <Button
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={createFood}
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="🔍 Tìm tên món…"
            className="max-w-sm border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v as MealType | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] rounded-xl border-emerald-200 dark:border-emerald-800">
              <SelectValue placeholder="Loại bữa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Bảng */}
      <Card className="rounded-2xl border-emerald-200/60 dark:border-emerald-900/40">
        <CardContent className="pt-6">
          <Table>
            <TableCaption className="text-foreground/70 dark:text-white/70">
              Dinh dưỡng/khẩu phần • Tổng: {filtered.length} món
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20">
                <TableHead className="text-emerald-700 dark:text-emerald-400">
                  Tên
                </TableHead>
                <TableHead className="text-emerald-700 dark:text-emerald-400">
                  Loại
                </TableHead>
                <TableHead className="text-right text-emerald-700 dark:text-emerald-400">
                  Calo
                </TableHead>
                <TableHead className="text-right text-emerald-700 dark:text-emerald-400">
                  Protein
                </TableHead>
                <TableHead className="text-right text-emerald-700 dark:text-emerald-400">
                  Carbs
                </TableHead>
                <TableHead className="text-right text-emerald-700 dark:text-emerald-400">
                  Fat
                </TableHead>
                <TableHead className="text-right text-emerald-700 dark:text-emerald-400">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {view.map((f) => (
                <TableRow
                  key={f._id}
                  className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                >
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>
                    <Badge className="rounded-xl capitalize bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                      {f.type ?? "breakfast"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{f.calories}</TableCell>
                  <TableCell className="text-right">
                    {f.protein ?? 0}g
                  </TableCell>
                  <TableCell className="text-right">{f.carbs ?? 0}g</TableCell>
                  <TableCell className="text-right">{f.fat ?? 0}g</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        onClick={() => startEdit(f)}
                        aria-label="Sửa"
                      >
                        <Pencil className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => deleteFood(f._id)}
                        aria-label="Xóa"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {view.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Phân trang */}
          <div className="flex justify-end items-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <span className="text-sm text-foreground/70 dark:text-white/70">
              Trang {page}/{total}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
              disabled={page >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[560px] rounded-2xl border-emerald-200 dark:border-emerald-800">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 dark:text-emerald-400">
              Sửa thực phẩm
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Tên món *</Label>
              <Input
                className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                value={editForm.name}
                onChange={(e) => updateEdit("name", e.target.value)}
              />
            </div>
            <div>
              <Label>Calo *</Label>
              <Input
                type="number"
                className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                value={editForm.calories}
                onChange={(e) => updateEdit("calories", e.target.value)}
                min={0}
              />
            </div>
            <div>
              <Label>Protein (g)</Label>
              <Input
                type="number"
                className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                value={editForm.protein}
                onChange={(e) => updateEdit("protein", e.target.value)}
                min={0}
              />
            </div>
            <div>
              <Label>Carbs (g)</Label>
              <Input
                type="number"
                className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                value={editForm.carbs}
                onChange={(e) => updateEdit("carbs", e.target.value)}
                min={0}
              />
            </div>
            <div>
              <Label>Fat (g)</Label>
              <Input
                type="number"
                className="border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500"
                value={editForm.fat}
                onChange={(e) => updateEdit("fat", e.target.value)}
                min={0}
              />
            </div>
            <div>
              <Label>Loại bữa</Label>
              <Select
                value={editForm.type}
                onValueChange={(v) => updateEdit("type", v as MealType)}
              >
                <SelectTrigger className="rounded-xl border-emerald-200 dark:border-emerald-800">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              className="rounded-xl border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
              onClick={() => setOpenEdit(false)}
            >
              Huỷ
            </Button>
            <Button
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={saveEdit}
              disabled={updating}
            >
              {updating ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
