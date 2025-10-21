const prisma = require("./prismaClient");

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function createUser(username, email, hashedPassword, bio, picture) {
  return prisma.user.create({
    data: { username, email, password: hashedPassword, bio, picture },
  });
}

module.exports = {
  findUserByEmail,
  createUser,
};
