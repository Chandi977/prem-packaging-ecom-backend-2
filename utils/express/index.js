const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const rootRouter = require("../../routes/index");
const healthRouter = require("../../routes/health");
var multer = require("multer");
const logger = require("../winston/logger");
const requestLogger = require("../middlewares/requestLogger"); // new
const app = express();
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const path = require("path");

module.exports = () => {
  try {
    dotenv.config();

    // If you have an auth middleware that populates req.user, you should
    // mount it BEFORE requestLogger so user info appears in logs:
    // app.use(authMiddleware);

    // Use request logger middleware
    app.use(requestLogger);

    app.use(
      cors({
        origin: [
          "https://www.store.prempackaging.com",
          "http://localhost:3000",
          "https://prem-packaging-ecom-frontend-9fab2c.vercel.app",
        ],
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(upload.single("image"));

    const PORT = process.env.PORT || 3000;

    app.get("/", (req, res) => {
      logger.info("Root route accessed");
      return res.send(
        "Welcome to Prempackaging. Visit - https://prempackaging.com for more details."
      );
    });

    app.get("/health", (req, res) => {
      logger.info("Health check accessed");
      return res.status(200).json({
        status: "ok",
        message: "Prempackaging backend is running smoothly",
        timestamp: new Date().toISOString(),
      });
    });

    app.use("/premind", healthRouter);
    app.use("/premind/api", rootRouter);

    // Generic error handler (logs the error and returns 500)
    // Place this AFTER your routes
    app.use((err, req, res, next) => {
      // include route and method in error log
      logger.error(
        `Unhandled error on ${req.method} ${req.originalUrl} - ${
          err.stack || err
        }`
      );
      // don't leak internal error details in production
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });

    app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
  } catch (error) {
    logger.error("Error starting the server:", error);
  }
};
