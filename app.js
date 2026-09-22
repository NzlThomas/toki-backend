import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { initSocket } from "./sockets/socket.js";
import express from "express";
import { socketHandler } from "./sockets/socketHandler.js";
import authMiddleware from "./middlewares/authMiddleware.js";
const { socketAuthMiddleware } = authMiddleware;

const app = express();
const server = createServer(app);
const io = initSocket(server);

import blogRouter from "./routes/messagesRouter.js";

const PORT = process.env.EXPRESS_PORT || 3000;

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  socketHandler(socket);
});

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

server.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server is listening on ${PORT}`);
});
