import express from "express";
import cookieParser from "cookie-parser";

import { corsMiddleware } from "./config/cors.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.use("/api", routes);

// error handler last
app.use(errorMiddleware);

export default app;