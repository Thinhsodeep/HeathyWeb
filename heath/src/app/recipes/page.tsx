"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Recipe = {
  id: string;
  name: string;
  tags: string[];
  kcal: number;
  protein: number;
  img?: string;
};

const RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Cơm gạo lứt ức gà",
    tags: ["eat-clean", "tăng-cơ"],
    kcal: 520,
    protein: 38,
  },
  {
    id: "r2",
    name: "Miến đậu phụ rau củ",
    tags: ["ăn-chay", "giảm-cân"],
    kcal: 420,
    protein: 22,
  },
];

export default function RecipesPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("all");
  const filtered = useMemo(
    () =>
      RECIPES.filter(
        (r) =>
          (tag === "all" || r.tags.includes(tag)) &&
          r.name.toLowerCase().includes(q.toLowerCase())
      ),
    [q, tag]
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex gap-3">
        <Input
          placeholder="Tìm công thức…"
          className="max-w-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex gap-2">
          {["all", "eat-clean", "giảm-cân", "tăng-cơ", "ăn-chay"].map((t) => (
            <Button
              key={t}
              variant={t === tag ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setTag(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.id} className="rounded-2xl overflow-hidden">
            <div className="h-36 w-full bg-muted/50 flex items-center justify-center">
              Ảnh minh hoạ
            </div>
            <CardHeader>
              <CardTitle className="text-base">{r.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {r.kcal} kcal • {r.protein}g protein
              </div>
              <div className="flex gap-1">
                {r.tags.slice(0, 2).map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-xl">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
