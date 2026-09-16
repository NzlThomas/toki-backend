import { prisma } from "../lib/prisma.js";

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}
async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      picture: true,
      bio: true,
      emailVerified: true,
      email: true,
    },
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

async function createEmailVerificationToken(token, userId, expiresAt) {
  return prisma.emailVerificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}

async function findToken(token) {
  return prisma.emailVerificationToken.findUnique({
    where: { token },
    select: { expiresAt: true, userId: true },
  });
}

async function verifyEmail(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
}

async function deleteEmailVerificationToken(token) {
  return prisma.emailVerificationToken.delete({
    where: { token },
  });
}

async function deleteEmailVerificationTokensByUserId(userId) {
  return prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });
}

async function updateProfile(requestedId, username, bio) {
  const userData = {};

  if (username !== undefined && username.trim() !== "") {
    userData.username = username.trim();
  }
  if (bio !== undefined) userData.bio = bio;

  return prisma.user.update({
    where: { id: requestedId },
    data: userData,
    select: {
      username: true,
      bio: true,
      picture: true,
    },
  });
}

async function uploadProfilePicture(userId, picture, picturePublicId) {
  return prisma.user.update({
    where: { id: userId },
    data: { picture, picturePublicId },
    select: { picture: true },
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

async function getUserConversations(userId) {
  return await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      sender: {
        select: { id: true, username: true, picture: true, bio: true },
      },
      receiver: {
        select: { id: true, username: true, picture: true, bio: true },
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

export default {
  findUserByEmail,
  findUserById,
  createUser,
  createEmailVerificationToken,
  findToken,
  verifyEmail,
  deleteEmailVerificationToken,
  deleteEmailVerificationTokensByUserId,
  updateProfile,
  sendMessage,
  getConversation,
  findMessage,
  updateMessage,
  deleteMessage,
  findReceiverById,
  findUserByName,
  uploadProfilePicture,
  getUserConversations,
};
