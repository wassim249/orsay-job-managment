const { PrismaClient } = require("@prisma/client");
const moment = require("moment");

const prisma = new PrismaClient({
  //   log: ["query", "info", "warn", "error"],
});
const searchForScans = async (req, res) => {
  try {
    const { searchValue, filter } = req.body;
    console.log(req.body);
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
          if (log[i].type === "error"){
            console.log(log[i] , 'hna' , scan.id);  
            return true};
          console.log(scan.id);

        return false;
      });

    else if (filter?.success)
      scans = scans.filter((scan) => {
        const log = JSON.parse(scan.log);
        for (let i = 0; i < log.length; i++)
          if (log[i].type === "error") {
            return false;
          }

            console.log(scan.id);
        return true;
      });

    res.json(scans);
  } catch (e) {
    console.log(e);
    res.json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  searchForScans,
};
