"use client";

import { useMemo, useState } from "react";
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

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
};

const MOCK: Food[] = [
  {
    id: "1",
    name: "Ức gà",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    category: "Thịt",
  },
  {
    id: "2",
    name: "Cá hồi",
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    category: "Cá",
  },
  {
    id: "3",
    name: "Gạo lứt",
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    category: "Ngũ cốc",
  },
];

export default function FoodsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const filtered = useMemo(
    () =>
      MOCK.filter(
        (f) =>
          (cat === "all" || f.category === cat) &&
          f.name.toLowerCase().includes(q.toLowerCase())
      ),
    [q, cat]
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Cơ sở dữ liệu thực phẩm</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            placeholder="Tìm kiếm tên món…"
            className="max-w-sm"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Thịt">Thịt</SelectItem>
              <SelectItem value="Cá">Cá</SelectItem>
              <SelectItem value="Ngũ cốc">Ngũ cốc</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <Table>
            <TableCaption>Giá trị dinh dưỡng theo 100g.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-right">Calo</TableHead>
                <TableHead className="text-right">Protein</TableHead>
                <TableHead className="text-right">Carbs</TableHead>
                <TableHead className="text-right">Fat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-xl">
                      {f.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{f.calories}</TableCell>
                  <TableCell className="text-right">{f.protein}g</TableCell>
                  <TableCell className="text-right">{f.carbs}g</TableCell>
                  <TableCell className="text-right">{f.fat}g</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
