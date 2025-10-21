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

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateProfile,
};
