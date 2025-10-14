import "dotenv/config";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

async function run() {
  await connectDB();
  await User.deleteMany({});

  const users = [
    {
      name: "Nguyen Tan Thinh",
      email: "thinh@gmail.com",
      passwordHash: await bcrypt.hash("123", 10),
    },
    {
      name: "Admin",
      email: "admin@gmail.com",
      passwordHash: await bcrypt.hash("123", 10),
    },
  ];

  await User.insertMany(users);
  console.log("✅ Seeded users into:", process.env.MONGODB_URI);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
