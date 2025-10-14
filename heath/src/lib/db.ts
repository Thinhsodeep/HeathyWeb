import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nutrition_ai";

if (!MONGODB_URI) {
  throw new Error("⚠️ Missing MONGODB_URI in environment variables");
}

// Giữ kết nối MongoDB khi dev (Next.js hot reload)
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as {
  mongoose: MongooseCache;
};

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = { conn: null, promise: null };
}

const cached = globalForMongoose.mongoose;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
