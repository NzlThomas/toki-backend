import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import express from "express";
const app = express();

import blogRouter from "./routes/messagesRouter.js";

const PORT = process.env.EXPRESS_PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/", blogRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server is listening on ${PORT}`);
});
