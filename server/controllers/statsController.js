const { PrismaClient } = require("@prisma/client");
const moment = require("moment");
const prisma = new PrismaClient({
  // log: ["query", "info", "warn", "error"],
});
const LANG = require("../../i18n/lang.json");

const successVsFailure = async (req, res) => {
  const { lang } = req.body;
  try {
    let { range } = req.body;

    let succededScans = null;
    let failedScans = null;
    if (range) {
      range = [
        moment(range[0]).format("YYYY-MM-DD hh:mm:ss"),
        moment(range[1]).format("YYYY-MM-DD hh:mm:ss"),
      ];
      succededScans = await prisma.$queryRawUnsafe(
        `SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM scan WHERE log NOT LIKE '%error%' AND DATE(createdAt) >= DATE('${range[0]}') AND DATE(createdAt) <= DATE('${range[1]}') GROUP BY date`
      );
      failedScans = await prisma.$queryRawUnsafe(
        `SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM scan WHERE log LIKE '%error%' AND DATE(createdAt) >= DATE('${range[0]}') AND DATE(createdAt) <= DATE('${range[1]}') GROUP BY date`
      );
    } else {
      succededScans =
        await prisma.$queryRaw`SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM scan WHERE log NOT LIKE '%error%' GROUP BY date`;
      failedScans =
        await prisma.$queryRaw`SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM scan WHERE log LIKE '%error%' GROUP BY date`;
    }

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
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

const getScanInfo = async (req, res) => {
  const { lang } = req.body;

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
    res.json({
      total,
      total7Days: total7Days[0]?.count,
      latestScan,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

const failedReason = async (req, res) => {
  const { lang } = req.body;

  try {
    let { range } = req.body;
    let failedScans = null;
    if (range)
      failedScans = await prisma.scan.findMany({
        where: {
          log: {
            contains: "error",
          },
          createdAt: {
            gte: new Date(range[0]),
            lte: new Date(range[1]),
          },
        },
      });
    else
      failedScans = await prisma.scan.findMany({
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
    const WORDS_TO_KEEP_FR = [
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
    const WORDS_TO_KEEP_DE = [
      ..."KONNTE NICHT ERSTELLT WERDEN".split(" "),
      "DATEI",
      ..."WURDE GEFUNDEN".split(" "),
      ..."AUFTRAG SN".split(" "),
      ..."NICHT GEFUNDEN".split(" "),
      ..."FEHLER BEIM ERSTELLEN DER LOG-DATEI".split(" "),
      ..."LOGVERZEICHNIS EXISTIERT NICHT".split(" "),
      ..."QUELLENVERZEICHNIS UND ZIELVERZEICHNIS SIND DAS SELBE".split(" "),
      ..."ZIELVERZEICHNIS EXISTIERT NICHT".split(" "),
      ..."QUELLENVERZEICHNIS EXISTIERT NICHT".split(" "),
      ..."BENUTZEN SIE BIS ZUM DATEIENABGLEICH EINEN REPERTOIRE".split(" "),
      ..."BENUTZEN SIE BIS ZUM DATEIENABGLEICH EINEN REPERTOIRE".split(" "),
    ];
    const WORDS_TO_KEEP_ENG = [
      ..."PLEASE CHOOSE A SOURCE DIRECTORY".split(" "),
      "DESTINATION",
      ..."SOURCE DIRECTORY DOES NOT EXIST".split(" "),
      ..."SOURCE AND DESTINATION DIRECTORIES ARE THE SAME".split(" "),
      ..."LOG DIRECTORY DOES NOT EXIST".split(" "),
      ..."ERROR CREATING LOG FILE".split(" "),
      ..."ORDER NOT FOUND".split(" "),
      ..."ORDER NUMBER".split(" "),
    ];
    reasonsMsgs = reasonsMsgs.map((reason) => {
      let newReason = reason.split(" ");
      newReason = newReason.filter(
        (word) =>
          WORDS_TO_KEEP_DE.includes(word) ||
          WORDS_TO_KEEP_ENG.includes(word) ||
          WORDS_TO_KEEP_FR.includes(word)
      );
      return newReason.join(" ");
    });

    let rs = reasonsMsgs.map((reason) => {
      let count = 0;
      reasonsMsgs.forEach((r) => {
        if (r == reason) count++;
      });
      return {
        reason,
        count,
      };
    });
    // remove duplicates from rs
    rs = rs.filter(
      (v, i, a) =>
        a.findIndex((v2) => v2.reason === v.reason || v.reason.trim() == "") ===
        i
    );

    rs = {
      reasons: rs,
      count: parseInt(rs.count || 0) + parseInt(rs.map((r) => r.count)),
    };
    res.json(rs);
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

const newUsers = async (req, res) => {
  const { lang } = req.body;

  try {
    let { range } = req.body;
    let scanners = null;
    let viewers = null;
    if (range) {
      range = [
        moment(range[0]).format("YYYY-MM-DD hh:mm:ss"),
        moment(range[1]).format("YYYY-MM-DD hh:mm:ss"),
      ];
      scanners = await prisma.$queryRawUnsafe(
        `SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM user WHERE createdAt >= DATE('${range[0]}') AND createdAt <= DATE('${range[1]}') AND role = 'scanner' GROUP BY date`
      );
      viewers = await prisma.$queryRawUnsafe(
        `SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM user WHERE createdAt >= DATE('${range[0]}') AND createdAt <= DATE('${range[1]}') AND role = 'viewer' GROUP BY date`
      );
    } else {
      scanners = await prisma.$queryRawUnsafe(
        `SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM user WHERE role = 'scanner' GROUP BY date`
      );
      viewers = await prisma.$queryRawUnsafe(
        `SELECT DISTINCT DATE(createdAt) AS date , count(id) AS count FROM user WHERE role = 'viewer' GROUP BY date`
      );
    }

    let usersScanners = [];
    let usersViewer = [];
    let dates = [];

    scanners.forEach((user) => {
      dates.push(moment(user.date).format("MM DD"));
    });
    viewers.forEach((user) => {
      dates.push(moment(user.date).format("MM DD"));
    });
    dates = [...new Set(dates)];

    dates.forEach((_, index) => {
      let scannersCount = 0;
      let viewersCount = 0;
      scanners.forEach((user) => {
        if (moment(user.date).format("MM DD") === dates[index]) {
          scannersCount += user.count;
        }
      });
      viewers.forEach((user) => {
        if (moment(user.date).format("MM DD") === dates[index]) {
          viewersCount += user.count;
        }
      });
      usersScanners.push(scannersCount);
      usersViewer.push(viewersCount);
    });

    res.json({
      scanners: usersScanners,
      viewers: usersViewer,
      dates,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

module.exports = {
  successVsFailure,
  getScanInfo,
  failedReason,
  newUsers,
};
