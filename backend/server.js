import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server is up and running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
