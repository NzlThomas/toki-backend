const prisma = require("./prismaClient");

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}
async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, picture: true, bio: true },
  });
}

async function findReceiverById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { username: true, picture: true, bio: true },
  });
}

async function findUserByName(name) {
  return prisma.user.findMany({
    where: { username: { contains: name, mode: "insensitive" } },
    select: { id: true, username: true, bio: true, picture: true },
  });
}

async function createUser(username, email, hashedPassword, bio, picture) {
  return prisma.user.create({
    data: { username, email, password: hashedPassword, bio, picture },
  });
}

async function updateProfile(requestedId, username, picture, bio) {
  const userData = {};

  if (username) userData.username = username;
  if (picture) userData.picture = picture;
  if (bio) userData.bio = bio;

  return prisma.user.update({
    where: { id: requestedId },
    data: userData,
  });
}

async function sendMessage(senderId, receiverId, message) {
  return prisma.message.create({
    data: { senderId, receiverId, text: message },
    include: {
      sender: { select: { id: true, username: true, picture: true } },
    },
  });
}

async function getConversation(connectedUserId, receiverId) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: connectedUserId, receiverId: receiverId },
        { senderId: receiverId, receiverId: connectedUserId },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: { username: true },
      },
      receiver: {
        select: { username: true },
      },
    },
  });
}

async function findMessage(messageId) {
  return prisma.message.findUnique({
    where: { id: messageId },
    select: { senderId: true },
  });
}

async function updateMessage(messageId, newText) {
  return prisma.message.update({
    where: { id: messageId },
    data: { text: newText },
  });
}

async function deleteMessage(messageId) {
  return prisma.message.delete({
    where: { id: messageId },
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateProfile,
  sendMessage,
  getConversation,
  findMessage,
  updateMessage,
  deleteMessage,
  findReceiverById,
  findUserByName,
};
