import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = catchAsync(async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !password) throw new ApiError(400, "name, email, password are required");

  const { user, token } = await registerUser({ name, email, phone, password, role });

  res.status(201).json({
    ok: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "email and password required");

  const { user, token } = await loginUser({ email, password });

  res.json({
    ok: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
});

export const me = catchAsync(async (req, res) => {
  res.json({ ok: true, user: req.user });
});