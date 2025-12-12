// middlewares/requestLogger.js
const logger = require("../winston/logger");

module.exports = (req, res, next) => {
  const start = process.hrtime();

  // get client IP (respecting proxies if present)
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

  // Helper to safely build user info if auth populated req.user
  const userInfo = req.user
    ? `UserID: ${req.user.id || "unknown"}${
        req.user.email ? " | Email: " + req.user.email : ""
      }`
    : "User: Guest";

  // When response finishes log status and timing
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const ms = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

    const msg = `${req.method} ${req.originalUrl} | IP: ${ip} | ${userInfo} | Status: ${res.statusCode} | ${ms} ms`;
    // Use info for 2xx/3xx, warn for 4xx, error for 5xx
    if (res.statusCode >= 500) {
      logger.error(msg);
    } else if (res.statusCode >= 400) {
      logger.warn(msg);
    } else {
      logger.info(msg);
    }
  });

  next();
};
