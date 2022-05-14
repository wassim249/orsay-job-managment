const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    console.log(req.body);
    const foundedUser = await prisma.user.findFirst({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
    });
    if (!foundedUser) {
      res.json({
        message: "Invalid credentials",
      });
    } else {
      await prisma.user.update({
        where: {
          id: foundedUser.id,
        },
        data: {
          lastConnection: new Date(),
        },
      });

      res.json({
        message: "Login successful",
        user: foundedUser,
      });
    }
    console.log(foundedUser);
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
    console.log(error);
  }
};

module.exports = {
  login,
};
