const { PrismaClient } = require("@prisma/client");
const moment = require("moment");
const prisma = new PrismaClient();

const successVsFailure = async (req, res) => {
  try {
    const succededScans =
      await prisma.$queryRaw`SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM scan WHERE log NOT LIKE '%error%' GROUP BY date`;
    const failedScans =
      await prisma.$queryRaw`SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM scan WHERE log LIKE '%error%' GROUP BY date`;
    let succeded = [];
    let failed = [];
    let dates = [];

    succededScans.forEach((scan) => {
      dates.push(moment(scan.date).format("MM DD"));
    });
    failedScans.forEach((scan) => {
      dates.push(moment(scan.date).format("MM DD"));
    });
    dates = [...new Set(dates)];

    dates.forEach((_, index) => {
      let succededCount = 0;
      let failedCount = 0;
      succededScans.forEach((scan) => {
        if (moment(scan.date).format("MM DD") === dates[index]) {
          succededCount += scan.count;
        }
      });
      failedScans.forEach((scan) => {
        if (moment(scan.date).format("MM DD") === dates[index]) {
          failedCount += scan.count;
        }
      });
      succeded.push(succededCount);
      failed.push(failedCount);
    });

    res.json({ succeded, failed, dates });
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
};

const getScanInfo = async (req, res) => {
  try {
    const total = await prisma.scan.count();
    const total7Days =
      await prisma.$queryRaw`SELECT count(id) AS count FROM scan WHERE createdAt > DATE_SUB(NOW(), INTERVAL 7 DAY)`;
    const latestScan = (
      await prisma.scan.findFirst({
        orderBy: {
          createdAt: "desc",
        },
      })
    )?.createdAt;

    console.log(latestScan, total7Days, total);
    res.json({
      total,
      total7Days: total7Days[0]?.count,
      latestScan,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
};

module.exports = {
  successVsFailure,
  getScanInfo
};
