import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO n'est pas initialisé");
  }

  return io;
}
