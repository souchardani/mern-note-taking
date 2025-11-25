// const express = require("express");
import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const __dirname = path.resolve();
//middleware

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173", // tu frontend
    })
  );
}

app.use(express.json()); //this middleware will parse the json bodies: req.body

app.use(rateLimiter);
app.use(morgan("dev"));
//sse puede usar app.use(cors());

//our simple custom middleware
// app.use((req, res, next) => {
//   console.log(`req method is ${req.method} and req url is ${req.url}`);
//   next();
// });

app.use("/api/notes", notesRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", index.html));
  });
}

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server started on PORT: ", port);
  });
});
