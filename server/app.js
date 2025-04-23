const express = require("express");
const cors = require("cors");
const { db } = require("./db/db");
const { readdirSync } = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// ─── Custom Error Class ───────────────────────────────────────────────────────
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── CORS & Built-in Middleware ───────────────────────────────────────────────
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// ─── API ROUTES ────────────────────────────────────────────────────────────────
// Auth
app.use("/api/v1/auth", require("./routes/authRoutes"));
// Other
readdirSync("./routes")
  .filter((f) => f.endsWith(".js") && f !== "authRoutes.js")
  .forEach((route) => {
    app.use("/api/v1", require(`./routes/${route}`));
  });

// ─── SERVE REACT FRONTEND ─────────────────────────────────────────────────────
// 1️⃣ Serve all of the static files
app.use(
  express.static(path.join(__dirname, "client", "build"))
);

// 2️⃣ On any GET request that's *not* an `/api/...`, send back React's `index.html`
app.get("*", (req, res, next) => {
  // If the URL starts with /api, skip to the next handler
  if (req.path.startsWith("/api/")) return next();

  res.sendFile(
    path.join(__dirname, "client", "build", "index.html"),
    (err) => {
      if (err) next(err);
    }
  );
});

// ─── 404 HANDLER ───────────────────────────────────────────────────────────────
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // In production, don't leak stack traces
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error("ERROR 💥", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
db();
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = { app, AppError };
