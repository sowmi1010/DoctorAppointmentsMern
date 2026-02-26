import { ApiError } from "../utils/ApiError.js";

export function requireFields(fields = []) {
  return (req, res, next) => {
    const missing = fields.filter((f) => req.body?.[f] === undefined || req.body?.[f] === "");
    if (missing.length) return next(new ApiError(400, `Missing fields: ${missing.join(", ")}`));
    next();
  };
}