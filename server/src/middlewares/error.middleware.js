import { ApiError } from "../utils/ApiError.js";

export function errorMiddleware(err, req, res, next) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message =
    err instanceof ApiError
      ? err.message
      : "Internal Server Error";

  // Duplicate key error from Mongo
  if (err?.code === 11000) {
    return res.status(409).json({ ok: false, message: "Duplicate data", details: err.keyValue });
  }

  res.status(status).json({ ok: false, message });
}