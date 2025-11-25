// const express = require("express");
import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import logger from "./config/logger.js";

dotenv.config();

const app = express();

// Trust the first proxy
app.set("trust proxy", 1);

const port = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL].filter(Boolean) // Filtra undefined/null
    : ["http://localhost:5173", "http://localhost:5174"];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (mismo servidor, Postman, curl, SSR)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

//middleware
app.use(helmet());
app.use(express.json()); //this middleware will parse the json bodies: req.body

app.use(rateLimiter);
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}
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
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`Server started on PORT: ${port}`);
  });
});
