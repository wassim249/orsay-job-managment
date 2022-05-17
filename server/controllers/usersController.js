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
        id: parseInt(req.params.id),
      },
      include: {
        Scan: true,
      },
    });
    delete user.password;
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
};

const editUser = async (req, res) => {
  try {
    console.log(req.params.id, req.body);
    const user = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...req.body,
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
};

const createUser = async (req, res) => {
  try {
    // check if email is already in use
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (user)
      res.json({
        message: "Email already in use",
      });
    else {
      const newUser = await prisma.user.create({
        data: {
          ...req.body,
          lastConnection : new Date('1970-01-01T00:00:00.000Z'),
        },
      });
      res.json({
        newUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  editUser,
  createUser
};
