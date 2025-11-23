// const express = require("express");
import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

//middleware
app.use(
  cors({
    origin: "http://localhost:5173", // tu frontend
  })
);
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

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server started on PORT: ", port);
  });
});
