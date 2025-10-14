import { Schema, model, models, type Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, collection: "users" }
);

// Model có kiểu Model<IUser>
export const User: Model<IUser> =
  (models.User as Model<IUser>) || model<IUser>("User", UserSchema);
