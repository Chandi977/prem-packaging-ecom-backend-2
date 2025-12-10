const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const rootRouter = require("../../routes/index");
const healthRouter = require("../../routes/health");
var multer = require("multer");
const app = express();
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const path = require("path");

module.exports = () => {
  try {
    dotenv.config();

    app.use(
      cors({
        origin: [
          "https://www.store.prempackaging.com",
          "http://localhost:3000",
          "https://prem-packaging-ecom-frontend-9fab2c.vercel.app/",
        ],
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(upload.single("image"));

    const PORT = process.env.PORT || 3000;

    app.get("/", (req, res) => {
      return res.send(
        "Welcome to Prempackaging. Visit - https://prempackaging.com for more details."
      );
    });
    router.get("/health", (req, res) => {
      return res.status(200).json({
        status: "ok",
        message: "Prempackaging backend is running smoothly",
        timestamp: new Date().toISOString(),
      });
    });

    app.use("/premind", healthRouter);
    app.use("/premind/api", rootRouter);

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};
