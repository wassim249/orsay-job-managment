const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllOrders = async (_, res) => {
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
    });
    res.json({
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
};

module.exports = {
  getAllOrders,
};
