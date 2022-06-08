const { PrismaClient } = require("@prisma/client");
const LANG = require("../../i18n/lang.json");
const prisma = new PrismaClient();

const getAllOrders = async (req, res) => {
  const { lang } = req.body;
  try {
    const orders = await prisma.orderNumber.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        scan: {
          include: {
            user: true,
          },
        },
      },
      orderBy : {
        createdAt : "desc"      
      }
    });
    res.json({
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

module.exports = {
  getAllOrders,
};
