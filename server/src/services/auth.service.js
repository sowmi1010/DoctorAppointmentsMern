import bcrypt from "bcrypt";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "./token.service.js";
import { ROLES } from "../constants/roles.js";

export async function registerUser({ name, email, phone, password, role }) {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    role: role && Object.values(ROLES).includes(role) ? role : ROLES.PATIENT,
  });

  const token = signToken(user._id.toString());
  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid email/password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid email/password");

  const token = signToken(user._id.toString());
  return { user, token };
}