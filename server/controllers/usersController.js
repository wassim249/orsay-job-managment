const prisma = require("../prisma/config");
const { sendEmail } = require("../helpers/utils");
const LANG = require("../../i18n/lang.json");

const getAllUsers = async (req, res) => {
  const { lang } = req.body;

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
      orderBy : {
        createdAt : "desc"      }
    });
    res.json({
      users,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
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
  const { lang } = req.body;
  delete req.body.lang;
  try {
    const user = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...req.body,
      },
    });
    sendEmail(user.email, "Your Orsay delivery job manager has been updated", {
      firstName: user.firstName,
      firstLine: `Your account has been updated`,
      secondLine:
        req.body.password && ` Your new password is: ${req.body.password}`,
    });
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

const createUser = async (req, res) => {
  const { lang } = req.body;

  try {
    // check if email is already in use
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (user)
      res.json({
        message: LANG["alerts"]["Email already in use"][lang],
      });
    else {
      const newUser = await prisma.user.create({
        data: {
          ...req.body,
          lastConnection: new Date("1970-01-01T00:00:00.000Z"),
        },
      });
      sendEmail(newUser.email, "Welcome to the Orsay delivery job manager", {
        firstName: newUser.firstName,
        firstLine: `Your account has been created, you can now login with your email and password`,
        secondLine: `Your password is: ${req.body.password}`,
      });
      res.json({
        newUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  editUser,
  createUser,
};
