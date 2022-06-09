const prisma = require("../prisma/config");
const os = require("os");
const moment = require("moment");
const { generatePassword, sendEmail } = require("../helpers/utils");
const LANG = require("../../i18n/lang.json");

const login = async (req, res) => {
  console.log(req.body);
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
    console.log(foundedUser);
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
    const { lang } = req.body;
    console.log(req.body);
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
          message: `${
            LANG["alerts"]["you already submitted a request in"][lang || "EN"]
          } ${moment(nonAcceptedRequest.createdAt).format("DD/MM/YYYY")} ${
            LANG["alerts"]["please contact your administrator"][lang || "EN"]
          }}`,
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
        message: LANG["alerts"]["Unvalid user name"][lang || "EN"],
      });
  } catch (error) {
    console.log(error);

    res.json({
      message: LANG["alerts"]["Internal server error"][lang || "EN"],
    });
  }
};

const getAuthRequests = async (req, res) => {
  try {
    const { lang } = req.body;

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

const changeRequestStatus = async (req, res) => {
  try {
    const { status, id, lang } = req.body;
    const { username } = os.userInfo();
    const pwd = generatePassword();
    console.log(req.body);
    if (status == "ACCEPTED") {
      // create new user
      await prisma.user.create({
        data: {
          firstName: username.split(".")[0],
          lastName: username.split(".")[1],
          email: `${username}@cgi.com`,
          role: "viewer",
          password: pwd,
        },
      });
    }
    // update request status
    const request = await prisma.request.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });
    if (request) {
      res.json({
        message: LANG["alerts"]["Request status updated"][lang || "EN"],
        request,
      });
      const context =
        status == "ACCEPTED"
          ? {
              firstName: username.split(".")[0],
              firstLine: `Welcome to the JOB manager tool`,

              secondLine: `Here are your credentials :`,
              thirdLine: `Email : ${username}@cgi.com`,
              fourthLine: `Password : ${pwd}`,
            }
          : {
              firstName: username.split(".")[0],
              firstLine: `Your request has been rejected`,
              secondLine: `Please contact your administrator`,
            };
      sendEmail(
        `${username}@cgi.com`,
        "Your request has been accepted",
        context
      );
    } else
      res.json({
        message: LANG["alerts"]["Internal server error"][lang || "EN"],
      });
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
  changeRequestStatus,
};
