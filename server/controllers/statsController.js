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

const failedReason = async (req, res) => {
  try {
    const failedScans = await prisma.scan.findMany({
      where: {
        log: {
          contains: "error",
        },
      },
    });

    let reasonsMsgs = [];
    failedScans.forEach((scan) => {
      const log = JSON.parse(scan.log);
      log.forEach((l) => {
        if (l.type === "error") reasonsMsgs.push(l.message);
      });
    });

    // remove unique values
    const wordsToKeep = [
      "LA",
      "COMMANDE",
      "N'A",
      "PAS",
      "ETE",
      "TROUVEE",
      ..."VEUILLEZ CHOISIR UN REPERTOIRE DE SOURCE".split(" "),
      "DESTINATION",
      "INEXISTANT",
      "SONT",
      "IDENTIQUES",
      "INEXISTANT",
      ..."ERREUR LORS DE LA CREATION DU FICHIER DE LOG".split(" "),
      ..."LE FICHIER N'A PAS PU ETRE CREE".split(" "),
    ];
    reasonsMsgs = reasonsMsgs.map((reason) => {
      let newReason = reason.split(" ");
      newReason = newReason.filter((word) => {
        return wordsToKeep.includes(word);
      });
      return newReason.join(" ");
    });

    let rs = reasonsMsgs.map((reason) => {
      let count = 0;
      reasonsMsgs.forEach((r) => {
        if (r === reason) count++;
      });
      return {
        reason,
        count,
      };
    });
    // remove duplicates from rs
    rs.forEach((r, index) => {
      for (let i = index + 1; i < rs.length; i++)
        if (rs[i].reason === r.reason) rs.splice(i, 1);
    });
rs = {
  reasons : rs ,
  count : parseInt(rs.count || 0) + parseInt( rs.map(r => r.count))
}
    res.json(rs);
  } catch (error) {
    console.log(error);
    res.json({
      message: "UNTERNAL ERROR",
    });
  }
};

module.exports = {
  successVsFailure,
  getScanInfo,
  failedReason,
};
