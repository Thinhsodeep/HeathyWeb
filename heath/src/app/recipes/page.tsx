// src/app/recipes/page.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flame, Leaf, Drumstick } from "lucide-react";

type Recipe = {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
  img: string;
  ingredients: string[];
  steps: string[];
};

// 15 CÔNG THỨC (có nguyên liệu + cách nấu)
const RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Cơm gạo lứt ức gà áp chảo",
    desc: "Món tăng cơ phổ biến, ít dầu mỡ và giàu protein.",
    tags: ["eat-clean", "tăng-cơ"],
    kcal: 520,
    protein: 42,
    carb: 45,
    fat: 8,
    img: "/recipes/chicken-rice.jpg",
    ingredients: [
      "150g ức gà",
      "100g gạo lứt",
      "1 thìa dầu olive",
      "Rau củ luộc (bông cải, cà rốt)",
      "Muối, tiêu, tỏi băm",
    ],
    steps: [
      "Luộc gạo lứt đến khi chín mềm.",
      "Ướp ức gà với muối, tiêu, tỏi 10 phút.",
      "Áp chảo ức gà vàng đều 2 mặt.",
      "Dùng kèm rau củ luộc.",
    ],
  },
  {
    id: "r2",
    name: "Miến đậu phụ rau củ",
    desc: "Bữa chay thanh đạm, giàu xơ và đạm thực vật.",
    tags: ["ăn-chay", "giảm-cân"],
    kcal: 410,
    protein: 20,
    carb: 60,
    fat: 9,
    img: "/recipes/vegan-noodles.jpg",
    ingredients: [
      "50g miến dong",
      "1 bìa đậu phụ",
      "Cà rốt, nấm, cải thìa",
      "Xì dầu, dầu mè, tỏi băm",
    ],
    steps: [
      "Luộc miến, vớt ra để ráo.",
      "Chiên vàng đậu phụ và cắt miếng.",
      "Xào rau với dầu mè + tỏi băm.",
      "Cho miến + xì dầu vào đảo đều.",
    ],
  },
  {
    id: "r3",
    name: "Salad cá ngừ olive",
    desc: "Bữa trưa nhẹ, hỗ trợ giảm cân hiệu quả.",
    tags: ["eat-clean", "giảm-cân"],
    kcal: 350,
    protein: 28,
    carb: 15,
    fat: 14,
    img: "/recipes/tuna-salad.jpg",
    ingredients: [
      "1 lon cá ngừ ngâm dầu",
      "Xà lách, cà chua bi, dưa leo",
      "2 thìa dầu olive, 1 thìa nước cốt chanh",
    ],
    steps: [
      "Rửa sạch, cắt nhỏ rau củ.",
      "Cho cá ngừ lên trên.",
      "Rưới olive + chanh, trộn nhẹ tay.",
    ],
  },
  {
    id: "r4",
    name: "Yến mạch sữa chua Hy Lạp",
    desc: "Bữa sáng nhanh, nhiều đạm và lợi khuẩn.",
    tags: ["ăn-sáng", "tăng-cơ"],
    kcal: 450,
    protein: 26,
    carb: 60,
    fat: 10,
    img: "/recipes/oatmeal.jpg",
    ingredients: [
      "50g yến mạch",
      "100ml sữa không đường",
      "1 hộp sữa chua Hy Lạp",
      "Chuối/việt quất",
    ],
    steps: [
      "Ngâm yến mạch với sữa 10 phút.",
      "Trộn cùng sữa chua.",
      "Thêm trái cây lên trên.",
    ],
  },
  {
    id: "r5",
    name: "Cá hồi nướng khoai lang",
    desc: "Omega-3, carb chậm hấp thu và chất xơ.",
    tags: ["eat-clean", "tăng-cơ"],
    kcal: 560,
    protein: 40,
    carb: 50,
    fat: 16,
    img: "/recipes/salmon.jpg",
    ingredients: [
      "150g cá hồi",
      "1 củ khoai lang",
      "Dầu olive, muối, tiêu, chanh",
    ],
    steps: [
      "Ướp cá hồi với muối, tiêu, chanh 15 phút.",
      "Nướng khoai và cá ở 180°C ~15 phút.",
      "Rưới thêm dầu olive khi ăn.",
    ],
  },
  {
    id: "r6",
    name: "Smoothie chuối bơ đậu phộng",
    desc: "Giàu năng lượng, phù hợp trước khi tập.",
    tags: ["ăn-sáng", "tăng-cơ"],
    kcal: 480,
    protein: 20,
    carb: 55,
    fat: 18,
    img: "/recipes/smoothie.jpg",
    ingredients: [
      "1 chuối",
      "1 thìa bơ đậu phộng",
      "150ml sữa hạt/tươi",
      "Đá viên",
    ],
    steps: [
      "Cho tất cả vào máy xay.",
      "Xay mịn 30 giây.",
      "Rót ra ly và dùng lạnh.",
    ],
  },
  {
    id: "r7",
    name: "Bún thịt nạc rau sống",
    desc: "Giảm cân nhẹ nhàng mà vẫn đủ chất.",
    tags: ["giảm-cân", "eat-clean"],
    kcal: 390,
    protein: 30,
    carb: 45,
    fat: 8,
    img: "/recipes/pork-noodle.jpg",
    ingredients: ["Bún tươi", "Thịt nạc xay", "Rau sống", "Nước mắm chua ngọt"],
    steps: [
      "Luộc bún, để ráo.",
      "Xào thịt nạc chín tới.",
      "Bày bún + rau + thịt, chan nước mắm chua ngọt.",
    ],
  },
  {
    id: "r8",
    name: "Salad trứng ngũ sắc",
    desc: "Nhiều vitamin và protein, ít calo.",
    tags: ["giảm-cân", "ăn-sáng"],
    kcal: 330,
    protein: 22,
    carb: 12,
    fat: 14,
    img: "/recipes/egg-salad.jpg",
    ingredients: [
      "2 trứng luộc",
      "Xà lách, bắp, cà rốt, ớt chuông",
      "Sốt sữa chua + chanh + mật ong",
    ],
    steps: [
      "Cắt nhỏ rau củ.",
      "Thái lát trứng luộc.",
      "Trộn cùng sốt sữa chua.",
    ],
  },
  {
    id: "r9",
    name: "Thịt bò xào bông cải xanh",
    desc: "Cung cấp sắt và đạm chất lượng cao.",
    tags: ["tăng-cơ", "eat-clean"],
    kcal: 520,
    protein: 46,
    carb: 20,
    fat: 14,
    img: "/recipes/beef-broccoli.jpg",
    ingredients: ["150g thịt bò", "Bông cải xanh", "Tỏi, dầu olive, xì dầu"],
    steps: [
      "Ướp bò với ít xì dầu, tỏi.",
      "Xào nhanh lửa lớn.",
      "Thêm bông cải, đảo 2–3 phút.",
    ],
  },
  {
    id: "r10",
    name: "Soup bí đỏ đậu lăng",
    desc: "Chay, ít calo, giàu chất xơ, nhẹ bụng.",
    tags: ["ăn-chay", "giảm-cân"],
    kcal: 300,
    protein: 14,
    carb: 40,
    fat: 6,
    img: "/recipes/pumpkin-soup.jpg",
    ingredients: ["Bí đỏ", "Đậu lăng", "Hành tây, tỏi", "Nước dùng rau củ"],
    steps: [
      "Xào hành tỏi, cho bí + đậu lăng vào.",
      "Đổ nước dùng, nấu mềm.",
      "Xay mịn, nêm lại cho vừa.",
    ],
  },
  {
    id: "r11",
    name: "Bánh mì ngũ cốc trứng ốp la",
    desc: "Bữa sáng nhanh gọn, giàu năng lượng.",
    tags: ["ăn-sáng", "eat-clean"],
    kcal: 420,
    protein: 23,
    carb: 45,
    fat: 12,
    img: "/recipes/egg-toast.jpg",
    ingredients: [
      "2 lát bánh mì ngũ cốc",
      "1–2 trứng gà",
      "Bơ/olive, muối tiêu",
    ],
    steps: [
      "Ốp la trứng theo ý.",
      "Nướng sơ bánh mì.",
      "Bày trứng lên bánh, nêm nếm.",
    ],
  },
  {
    id: "r12",
    name: "Nui xào ức gà rau củ",
    desc: "Món tăng cơ đơn giản, dễ làm.",
    tags: ["tăng-cơ"],
    kcal: 540,
    protein: 40,
    carb: 60,
    fat: 9,
    img: "/recipes/pasta-chicken.jpg",
    ingredients: ["Nui khô", "Ức gà", "Cà rốt, ớt chuông", "Tỏi, dầu olive"],
    steps: [
      "Luộc nui chín al dente.",
      "Áp chảo ức gà cắt lát.",
      "Xào chung với rau củ, trộn nui.",
    ],
  },
  {
    id: "r13",
    name: "Cơm cuộn rong biển cá ngừ",
    desc: "Ít dầu mỡ, nhiều đạm, ăn nhẹ tiện lợi.",
    tags: ["giảm-cân", "ăn-sáng"],
    kcal: 360,
    protein: 28,
    carb: 40,
    fat: 8,
    img: "/recipes/sushi.jpg",
    ingredients: [
      "Cơm trắng/nhạt",
      "Rong biển nori",
      "Cá ngừ hộp",
      "Dưa leo, cà rốt",
    ],
    steps: [
      "Trải cơm mỏng lên nori.",
      "Thêm cá ngừ + dưa leo + cà rốt.",
      "Cuộn chặt, cắt khoanh.",
    ],
  },
  {
    id: "r14",
    name: "Rau củ nướng dầu olive",
    desc: "Giàu vitamin, ăn kèm hoặc chay đều ngon.",
    tags: ["ăn-chay", "eat-clean"],
    kcal: 290,
    protein: 8,
    carb: 25,
    fat: 10,
    img: "/recipes/grilled-veggies.jpg",
    ingredients: ["Bí ngòi, cà tím, ớt chuông", "Dầu olive, muối, tiêu"],
    steps: [
      "Cắt miếng rau củ vừa ăn.",
      "Trộn dầu olive + muối + tiêu.",
      "Nướng 180°C trong 12–15 phút.",
    ],
  },
  {
    id: "r15",
    name: "Phở gà Eat Clean",
    desc: "Ít dầu mỡ, nước dùng trong, đạm nạc.",
    tags: ["eat-clean"],
    kcal: 480,
    protein: 34,
    carb: 60,
    fat: 9,
    img: "/recipes/pho-chicken.jpg",
    ingredients: ["Bánh phở", "Ức gà", "Hành, gừng nướng", "Rau thơm, gia vị"],
    steps: [
      "Luộc ức gà, xé sợi.",
      "Ninh nước dùng với hành, gừng nướng.",
      "Chần bánh phở, chan nước, thêm gà + rau thơm.",
    ],
  },
];

export default function RecipesPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Recipe | null>(null);

  const pageSize = 6;

  const filtered = useMemo(() => {
    const list = RECIPES.filter(
      (r) =>
        (tag === "all" || r.tags.includes(tag)) &&
        r.name.toLowerCase().includes(q.toLowerCase())
    );
    return list;
  }, [q, tag]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <motion.div
      className="container mx-auto px-4 py-8 space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          🍽️ Thư Viện Công Thức Ăn Uống
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Hơn chục món Eat Clean, tăng cơ, giảm cân và ăn chay — kèm nguyên liệu
          & cách nấu chi tiết.
        </p>
      </div>

      {/* Tìm kiếm + Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Input
          placeholder="🔍 Tìm công thức..."
          className="max-w-sm"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tất cả" },
            { id: "eat-clean", label: "Eat Clean" },
            { id: "giảm-cân", label: "Giảm cân" },
            { id: "tăng-cơ", label: "Tăng cơ" },
            { id: "ăn-chay", label: "Ăn chay" },
          ].map((t) => (
            <Button
              key={t.id}
              variant={t.id === tag ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => {
                setTag(t.id);
                setPage(1);
              }}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Grid danh sách */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((r) => (
          <Card
            key={r.id}
            onClick={() => setSelected(r)}
            className="rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={r.img}
                alt={r.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <CardHeader className="pb-1">
              <CardTitle className="text-lg">{r.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground line-clamp-2">{r.desc}</p>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" /> {r.kcal} kcal
                </span>
                <span className="flex items-center gap-1">
                  <Drumstick className="h-4 w-4 text-red-500" /> {r.protein}g
                </span>
                <span className="flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-green-500" /> {r.carb}g
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {r.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-xl">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau →
          </Button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          Không tìm thấy công thức phù hợp 😢
        </div>
      )}

      {/* Modal chi tiết */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-2xl rounded-2xl overflow-hidden">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selected.name}
                </DialogTitle>
              </DialogHeader>

              <div className="relative h-56 w-full rounded-lg overflow-hidden">
                <Image
                  src={selected.img}
                  alt={selected.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4 mt-4">
                <p className="text-muted-foreground">{selected.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-xl">
                      {t}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">🥦 Nguyên liệu</h3>
                    <ul className="list-disc pl-6 text-sm space-y-1 text-muted-foreground">
                      {selected.ingredients.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">👩‍🍳 Cách nấu</h3>
                    <ol className="list-decimal pl-6 text-sm space-y-1 text-muted-foreground">
                      {selected.steps.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap justify-around text-sm text-muted-foreground">
                  <span>🔥 {selected.kcal} kcal</span>
                  <span>🍗 {selected.protein}g Protein</span>
                  <span>🌾 {selected.carb}g Carb</span>
                  <span>🥑 {selected.fat}g Fat</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
