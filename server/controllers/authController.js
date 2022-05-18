const prisma = require("../prisma/config");

const login = async (req, res) => {
  try {
    if (req.body.email == "" || req.body.password == "")
      res.json({
        error: "true",
        message: "Please enter email and password",
      });
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
