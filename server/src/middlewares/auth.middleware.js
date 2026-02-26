import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) throw new ApiError(401, "Unauthorized: token missing");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) throw new ApiError(401, "Unauthorized: user not found");

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, "Unauthorized"));
  }
}