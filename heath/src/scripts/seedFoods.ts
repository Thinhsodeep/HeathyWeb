import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { Food } from "../lib/models/Food";

async function run() {
  try {
    await connectDB();
    await Food.deleteMany({});

    await Food.insertMany([
      // ===== Breakfast =====
      {
        name: "Yến mạch + sữa chua Hy Lạp + chuối",
        calories: 400,
        protein: 22,
        carbs: 55,
        fat: 10,
        type: "breakfast",
      },
      {
        name: "Bánh mì ngũ cốc + trứng ốp la + salad",
        calories: 420,
        protein: 24,
        carbs: 45,
        fat: 14,
        type: "breakfast",
      },
      {
        name: "Bánh mì bơ đậu phộng + sữa tươi",
        calories: 480,
        protein: 18,
        carbs: 52,
        fat: 18,
        type: "breakfast",
      },
      {
        name: "Phô mai + trứng chiên + bánh mì đen",
        calories: 430,
        protein: 26,
        carbs: 36,
        fat: 18,
        type: "breakfast",
      },
      {
        name: "Smoothie chuối, whey, bơ hạnh nhân",
        calories: 390,
        protein: 28,
        carbs: 40,
        fat: 12,
        type: "breakfast",
      },
      {
        name: "Xôi đậu + sữa đậu nành",
        calories: 440,
        protein: 16,
        carbs: 70,
        fat: 8,
        type: "breakfast",
      },
      {
        name: "Bún/miến gà xé + trứng",
        calories: 410,
        protein: 30,
        carbs: 48,
        fat: 10,
        type: "breakfast",
      },

      // ===== Lunch =====
      {
        name: "Cơm gạo lứt + ức gà áp chảo + rau củ",
        calories: 550,
        protein: 45,
        carbs: 60,
        fat: 12,
        type: "lunch",
      },
      {
        name: "Cơm + thịt bò xào súp lơ",
        calories: 600,
        protein: 38,
        carbs: 62,
        fat: 18,
        type: "lunch",
      },
      {
        name: "Bún thịt nạc + rau sống",
        calories: 520,
        protein: 28,
        carbs: 65,
        fat: 12,
        type: "lunch",
      },
      {
        name: "Bánh mì ức gà + khoai tây nướng",
        calories: 560,
        protein: 42,
        carbs: 65,
        fat: 12,
        type: "lunch",
      },
      {
        name: "Mì Ý sốt thịt bò + salad",
        calories: 590,
        protein: 36,
        carbs: 72,
        fat: 14,
        type: "lunch",
      },
      {
        name: "Cơm + cá basa kho + canh chua",
        calories: 570,
        protein: 32,
        carbs: 72,
        fat: 14,
        type: "lunch",
      },
      {
        name: "Phở bò nạm ít béo",
        calories: 520,
        protein: 32,
        carbs: 70,
        fat: 10,
        type: "lunch",
      },

      // ===== Dinner =====
      {
        name: "Cá hồi áp chảo + khoai lang + súp lơ",
        calories: 600,
        protein: 42,
        carbs: 50,
        fat: 20,
        type: "dinner",
      },
      {
        name: "Đậu phụ sốt cà + miến lứt + rau xanh",
        calories: 520,
        protein: 28,
        carbs: 62,
        fat: 14,
        type: "dinner",
      },
      {
        name: "Thịt nạc thăn + cơm + cải thìa xào tỏi",
        calories: 560,
        protein: 40,
        carbs: 60,
        fat: 14,
        type: "dinner",
      },
      {
        name: "Lườn vịt áp chảo + quinoa + salad",
        calories: 610,
        protein: 45,
        carbs: 52,
        fat: 18,
        type: "dinner",
      },
      {
        name: "Tôm hấp + bông cải xanh + cơm gạo lứt",
        calories: 540,
        protein: 38,
        carbs: 58,
        fat: 12,
        type: "dinner",
      },
      {
        name: "Món chay: đậu gà hầm cà chua + couscous",
        calories: 560,
        protein: 22,
        carbs: 86,
        fat: 10,
        type: "dinner",
      },
      {
        name: "Bò hầm khoai tây + cà rốt",
        calories: 580,
        protein: 40,
        carbs: 58,
        fat: 16,
        type: "dinner",
      },

      // ===== Snack =====
      {
        name: "Hạnh nhân 30g",
        calories: 170,
        protein: 6,
        carbs: 6,
        fat: 15,
        type: "snack",
      },
      {
        name: "Táo + bơ đậu phộng",
        calories: 220,
        protein: 5,
        carbs: 28,
        fat: 10,
        type: "snack",
      },
      {
        name: "Sữa chua Hy Lạp 170g + mật ong",
        calories: 190,
        protein: 16,
        carbs: 18,
        fat: 5,
        type: "snack",
      },
      {
        name: "Chuối + whey protein (1 scoop)",
        calories: 210,
        protein: 24,
        carbs: 22,
        fat: 2,
        type: "snack",
      },
      {
        name: "Thanh ngũ cốc yến mạch",
        calories: 200,
        protein: 8,
        carbs: 28,
        fat: 7,
        type: "snack",
      },
      {
        name: "Bắp rang bơ ít dầu 30g",
        calories: 150,
        protein: 4,
        carbs: 24,
        fat: 5,
        type: "snack",
      },
      {
        name: "Phô mai con bò cười + bánh quy lúa mạch",
        calories: 180,
        protein: 7,
        carbs: 20,
        fat: 8,
        type: "snack",
      },

      // ===== High-protein options =====
      {
        name: "Ức gà luộc 150g + khoai lang",
        calories: 430,
        protein: 45,
        carbs: 45,
        fat: 6,
        type: "lunch",
      },
      {
        name: "Thịt bò phi lê 180g + gạo lứt",
        calories: 640,
        protein: 48,
        carbs: 62,
        fat: 16,
        type: "dinner",
      },
      {
        name: "Cơm + cá ngừ áp chảo + salad dầu giấm",
        calories: 560,
        protein: 44,
        carbs: 60,
        fat: 12,
        type: "lunch",
      },
    ]);

    console.log("✅ Seeded foods successfully");
  } catch (e) {
    console.error("❌ Seed foods failed:", e);
  } finally {
    await mongoose.disconnect();
  }
}

run();
