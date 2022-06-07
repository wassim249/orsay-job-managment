const prisma = require("../prisma/config");
const os = require("os");
const moment = require("moment");

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

const registerRequest = async (req, res) => {
  try {
    const { username } = os.userInfo();
    if (username) {
      // check if user already have a pending or accepted request
      const nonAcceptedRequest = await prisma.request.findFirst({
        where: {
          username: username,
          OR: [
            {
              status: "PENDING",
            },
            {
              status: "ACCEPTED",
            },
          ],
        },
      });
      // if so send message
      if (nonAcceptedRequest)
        res.json({
          message: `you already submitted a request in ${moment(
            nonAcceptedRequest.createdAt
          ).format("DD/MM/YYYY")} please contact your administrator`,
        });
      // otherwise create a new request in the database and send it
      else {
        const request = await prisma.request.create({
          data: {
            username: username,
          },
        });
        res.json({
          request,
        });
      }
    } else
      res.json({
        message: "Unvalid user name",
      });
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal server error",
    });
  }
};

const getAuthRequests = async (_, res) => {
  try {
    const requests = await prisma.request.findMany();
    return res.json({
      requests,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal server error",
    });
  }
};

const changeRequestStatus = (req, res) => {
  try {
    const { status } = req.body;
    if (status == "ACCEPTED") {
      // create new user
    }
    // update request status
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  login,
  registerRequest,
  getAuthRequests,
};
