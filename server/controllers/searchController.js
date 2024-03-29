const { PrismaClient } = require("@prisma/client");
const moment = require("moment");
const LANG = require("../../i18n/lang.json");

const prisma = new PrismaClient({
  //   log: ["query", "info", "warn", "error"],
});
const searchForScans = async (req, res) => {
  const { lang } = req.body;

  try {
    const { searchValue, filter } = req.body;
    let scans = await prisma.scan.findMany({
      where: {
        scheduled: filter?.scheduled || undefined,
        finished: filter?.finished || undefined,
        createdAt: {
          gte: filter?.last30Days
            ? moment().subtract(30, "days").toDate()
            : filter?.last7Days
            ? moment().subtract(7, "days").toDate()
            : undefined,
        },
      },
      include: {
        OrderNumber: true,
      },
    });
    scans = scans.filter((scan) => {
      for (let i = 0; i < scan.OrderNumber.length; i++)
        if (scan.OrderNumber[i].order.includes(searchValue)) return true;
      return false;
    });

    if (filter?.failed)
      scans = scans.filter((scan) => {
        const log = JSON.parse(scan.log);
        for (let i = 0; i < log.length; i++)
          if (log[i].type === "error") return;

        return false;
      });
    else if (filter?.success)
      scans = scans.filter((scan) => {
        const log = JSON.parse(scan.log);
        for (let i = 0; i < log.length; i++)
          if (log[i].type === "error") {
            return false;
          }
        return true;
      });

    res.json(scans);
  } catch (e) {
    console.log(e);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

const searchForOrders = async (req, res) => {
  const { lang } = req.body;

  try {
    const { searchValue, filter } = req.body;
    let orders = await prisma.orderNumber.findMany({
      where: {
        createdAt: {
          gte: filter?.last30Days
            ? moment().subtract(30, "days").toDate()
            : filter?.last7Days
            ? moment().subtract(7, "days").toDate()
            : undefined,
        },
      },
      include: {
        scan: {
          include: {
            user: true,
          },
        },
      },
    });
    orders = orders.filter((order) => order.order.includes(searchValue));
    if (filter?.failed)
      orders = orders.filter((order) => order.status === "error");
    else if (filter?.success)
      orders = orders.filter((order) => order.status === "failed");

    res.json(orders);
  } catch (e) {
    console.log(e);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

module.exports = {
  searchForScans,
  searchForOrders,
};
