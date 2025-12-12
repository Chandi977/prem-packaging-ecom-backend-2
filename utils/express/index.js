// express/index.js
"use strict";

const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const xss = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const rootRouter = require("../../routes/index");
const healthRouter = require("../../routes/health");
const logger = require("../winston/logger");
const requestLogger = require("../middlewares/requestLogger");

const app = express();

// Multer setup (memory storage for small files; consider disk/S3 for large uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Trust proxy (so req.ip, req.protocol, secure cookies work behind reverse proxies)
app.set("trust proxy", 1);

/*
 * ---------- SECURITY & PERFORMANCE MIDDLEWARE ----------
 */
// Secure HTTP headers
app.use(helmet());

// Basic XSS protection for incoming payloads
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());

// Gzip compression for responses
app.use(compression());

/*
 * ---------- LOGGING ----------
 * Ensure requestLogger writes to your winston logger.
 * Keep this near the top so it captures all requests.
 */
app.use(requestLogger);

/*
 * ---------- CORS (dynamic, production-safe) ----------
 * Provide allowed origins via env var: CORS_WHITELIST="https://a.com,https://b.com,http://localhost:3000"
 */
const parseWhitelist = (raw = "") =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const whitelist = parseWhitelist(
  process.env.CORS_WHITELIST || "http://localhost:3000"
);
const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow non-browser tools (curl/postman)
  return whitelist.includes(origin);
};

// Use cors with dynamic origin function to ensure Access-Control-Allow-Origin is set correctly
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = isOriginAllowed(origin);
      if (!allowed) {
        return cb(new Error("CORS_NOT_ALLOWED"), false);
      }
      // when origin is undefined (server-to-server), allow
      cb(null, !!origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Explicit preflight handler to opt-in to Private Network Access when requested.
// IMPORTANT: Only set Access-Control-Allow-Private-Network if the server is actually reachable by the client.
app.options("*", (req, res) => {
  const origin = req.get("Origin");
  if (!isOriginAllowed(origin)) {
    return res.status(403).send("CORS origin denied");
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Chrome sends this header when it wants to access a private network (localhost/192.168.x.x).
  if (req.header("Access-Control-Request-Private-Network") === "true") {
    // Only include this header if your server is intended to be called from the public web into a private address.
    // If your backend is running on localhost for development, this will NOT make it reachable from remote browsers.
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }

  return res.sendStatus(204);
});

/*
 * ---------- BODY PARSERS & UPLOAD ----------
 * Keep payload limits conservative for production
 */
app.use(express.json({ limit: process.env.BODY_PARSER_LIMIT || "10kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.BODY_PARSER_LIMIT || "10kb",
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET || ""));

// Attach multer for endpoints that expect a file named 'image'
// Note: if you have many multipart endpoints, mount multer specifically on those routes instead of globally.
app.use((req, res, next) => {
  // Only parse multipart/form-data requests
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    upload.single("image")(req, res, next);
  } else {
    next();
  }
});

/*
 * ---------- RATE LIMITING ----------
 * Apply to API routes in production; adjust window/max via env vars.
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || "300", 10),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    }),
});
app.use("/premind/api", apiLimiter);

/*
 * ---------- APPLICATION ROUTES ----------
 */
app.get("/", (req, res) => {
  logger.info("Root route accessed", { ip: req.ip });
  return res.send(
    "Welcome to Prempackaging. Visit - https://prempackaging.com for more details."
  );
});

app.get("/health", (req, res) => {
  logger.info("Health check accessed", { ip: req.ip });
  return res.status(200).json({
    status: "ok",
    message: "Prempackaging backend is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.use("/premind", healthRouter);
app.use("/premind/api", rootRouter);

/*
 * ---------- STATIC ASSETS ----------
 * If you serve any static assets from the API server, enable and lock down the folder.
 * app.use('/static', express.static(path.join(__dirname, '../../public'), { maxAge: '1d' }));
 */

/*
 * ---------- 404 HANDLER ----------
 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

/*
 * ---------- CENTRAL ERROR HANDLER ----------
 */
app.use((err, req, res, next) => {
  // Log full error server-side
  logger.error(
    `Unhandled error on ${req.method} ${req.originalUrl} - ${err.stack || err}`,
    {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
    }
  );

  // CORS rejection
  if (err && err.message === "CORS_NOT_ALLOWED") {
    return res
      .status(403)
      .json({ success: false, message: "CORS origin denied" });
  }

  // Known library errors can carry status
  const status = err.status || 500;
  const safeMessage = status === 500 ? "Internal server error" : err.message;

  const payload = { success: false, message: safeMessage };

  // Add details in non-production for easier debugging
  if (process.env.NODE_ENV !== "production") {
    payload.error = err.stack || err;
  }

  res.status(status).json(payload);
});

/*
 * ---------- START SERVER & GRACEFUL SHUTDOWN ----------
 * This file intentionally starts the server to match the shape of your original module.
 * In larger apps you may export app and start in a separate server/bootstrap file.
 */
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () =>
  logger.info(
    `Server is running on ${HOST}:${PORT} (env=${
      process.env.NODE_ENV || "development"
    })`
  )
);

// Graceful shutdown handlers
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  // stop accepting new connections
  server.close((err) => {
    if (err) {
      logger.error("Error while closing server", err);
      process.exit(1);
    }
    logger.info("Server closed. Exiting process.");
    process.exit(0);
  });

  // force exit if shutdown takes too long
  setTimeout(() => {
    logger.warn("Forcing shutdown after timeout");
    process.exit(1);
  }, parseInt(process.env.SHUTDOWN_TIMEOUT_MS || "30000", 10));
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// catch unhandled rejections and exceptions to avoid silent failure
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { err });
  // exit so process manager can restart
  process.exit(1);
});
