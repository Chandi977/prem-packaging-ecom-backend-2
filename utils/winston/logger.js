const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

// Log format
const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} | ${level.toUpperCase()} | ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console logs
    new transports.Console(),

    // Daily rotated file logs
    new transports.DailyRotateFile({
      filename: "logs/%DATE%-info.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      level: "info",
      maxSize: "20m",
      maxFiles: "14d",
    }),

    new transports.DailyRotateFile({
      filename: "logs/%DATE%-error.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      level: "error",
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});

module.exports = logger;
