const prisma = require("./prismaClient");

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}
async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
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
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateProfile,
  sendMessage,
};
