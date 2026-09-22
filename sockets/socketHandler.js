function socketHandler(socket) {
  const userId = socket.userId;
  socket.join(`user:${userId}`);
}

function updateUi(io, id, newMsg) {
  io.to(`user:${id}`).emit("new-message", newMsg);
}

function updateDeletedMessage(io, id, deletedMsg) {
  io.to(`user:${id}`).emit("message-deleted", deletedMsg);
}

export { socketHandler, updateUi, updateDeletedMessage };
