import mongoose, { Schema, models, model } from "mongoose";

const FoodSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    default: "breakfast",
  },
});

export const Food = models.Food || model("Food", FoodSchema);
