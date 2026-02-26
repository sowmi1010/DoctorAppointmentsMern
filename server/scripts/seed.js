import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";
import { ROLES } from "../src/constants/roles.js";
import { connectDB } from "../src/config/db.js";

await connectDB(process.env.MONGO_URI);

const passwordHash = await bcrypt.hash("Admin@123", 10);

const adminEmail = "tamilsowmi1010@gmail.com";
const exists = await User.findOne({ email: adminEmail });

if (!exists) {
  await User.create({
    name: "Admin",
    email: adminEmail,
    phone: "9999999999",
    passwordHash,
    role: ROLES.ADMIN,
  });
  console.log("✅ Admin created: tamilsowmi1010@gmail.com / Admin@123");
} else {
  console.log("ℹ️ Admin already exists");
}

await mongoose.disconnect();
