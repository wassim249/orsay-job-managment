const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "admin",
        },
      },
      include: {
        Scan: true,
      },
    });
    console.log(users);
    res.json({
      users,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id:parseInt(req.params.id),
      },
      include: {
        Scan: true,
      },
    });
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
}



module.exports = {
    getAllUsers,
    getUser
}