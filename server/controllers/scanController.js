const LANG = require("../../i18n/lang.json");

const prisma = require("../prisma/config");
const { searchForXmlFile } = require("../helpers/thread");
const {
  isDirectory,
  createLogFile,
  log,
  createXmlFile,
  extractLineFromXml,
  sendEmail,
} = require("../helpers/utils");
const { Worker } = require("worker_threads");
const moment = require("moment");

const createScan = async (req, res) => {
  const {lang} = req.body
  console.log(lang);
  let { source, destination, logDir, orders, userId } = req.body;
  const user = await prisma.user.findFirst({ where: { id: userId } });

  let output = {
    finishedOrders: [],
    log: [],
  };
  let error = false;

  let createdOrders = [];
  let scan = null;

  orders = orders.filter((item, pos) => orders.indexOf(item) == pos);

  if (!source || source == "") {
    output.log.push({
      message: LANG["alerts"]["VEUILLEZ CHOISIR UN REPERTOIRE DE SOURCE"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    return;
  }
  if (!destination || destination == "") {
    output.log.push({
      message:
        LANG["alerts"]["VEUILLEZ CHOISIR UN REPERTOIRE DE DESTINATION"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    return;
  }

  if (!isDirectory(source.trim())) {
    output.log.push({
      message: LANG["alerts"]["REPERTOIRE DE SOURCE INEXISTANT"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    return;
  }

  if (!isDirectory(destination.trim())) {
    output.log.push({
      message: LANG["alerts"]["REPERTOIRE DE DESTINATION INEXISTANT"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    return;
  }

  if (source === destination) {
    output.log.push({
      message:
        LANG["alerts"]["REPERTOIRE DE SOURCE ET DESTINATION SONT IDENTIQUES"][
          lang
        ],
      type: "error",
    });
    res.json({
      output,
      logFile: logDir,
    });
    error = true;
    return;
  }

  if (!logDir || logDir?.trim() == "") logDir = destination.trim();
  else if (!isDirectory(logDir.trim())) {
    output.log.push({
      message: LANG["alerts"]["REPERTOIRE DE LOG INEXISTANT"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    sendEmail(user?.email || "", "The following scan failed", {
      firstName: user?.firstName,
      firstLine: `The following scan failed at ${moment().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      secondLine: `Reason : ${logDir} is not a directory.`,
      thirdLine: `Source : ${source}`,
      fourthLine: `Destination : ${destination}`,
      fifthLine: `Orders : ${orders}`,
    });
    error = true;
    return;
  }

  const logFile = createLogFile(logDir);
  if (!logFile) {
    output.log.push({
      message:
        LANG["alerts"]["ERREUR LORS DE LA CREATION DU FICHIER DE LOG"][lang],
      type: "error",
    });
    sendEmail(user?.email || "", "The following scan failed", {
      firstName: user?.firstName,
      firstLine: `The following scan failed at ${moment().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      secondLine: `Reason : an error occured while creating the log file in ${logDir}`,
      thirdLine: `Source : ${source}`,
      fourthLine: `Destination : ${destination}`,
      fifthLine: `Orders : ${orders}`,
    });
    error = true;
    res.json({
      output,
      logFile: logDir,
    });
    error = true;
    return;
  }

  orders.forEach(async (order, index) => {
    const createdOrder = {
      order,
      status: "success",
    };
    log(
      logFile,
      `${LANG["alerts"]["AU COURS DE RECHERCHE DE LA COMMANDE"][lang]} : ${order}`
    );
    output.log.push({
      message: `${LANG["alerts"]["AU COURS DE RECHERCHE DE LA COMMANDE"][lang]} : ${order}`,
      type: "info",
    });

    const file = await searchForXmlFile(source, order);
    if (!file) {
      createdOrder.status = "error";
      log(
        logFile,
        `${LANG["alerts"]["LA COMMANDE"][lang]} ${order} ${LANG["alerts"]["N'A PAS ETE TROUVEE"][lang]}`
      );
      output.log.push({
        message: `${LANG["alerts"]["LA COMMANDE"][lang]} ${order} ${LANG["alerts"]["N'A PAS ETE TROUVEE"][lang]}`,
        type: "error",
      });
      output.finishedOrders.push({
        order,
        success: false,
      });
      createdOrders.push(createdOrder);
      sendEmail(user?.email || "", "The following scan failed", {
        firstName: user?.firstName,
        firstLine: `The following scan failed at ${moment().format(
          "DD/MM/YYYY HH:mm:ss"
        )}`,
        secondLine: `Reason : the order ${order} was not found in ${source}`,
        thirdLine: `Source : ${source}`,
        fourthLine: `Destination : ${destination}`,
        fifthLine: `Orders : ${orders}`,
      });
      error = true;
    } else {
      createdOrder.file = file;
      log(logFile, `LE FICHIER : ${file} EST TROUVE`);
      output.log.push({
        message: `LE FICHIER : ${file} EST TROUVE`,
        type: "info",
      });

      const value = extractLineFromXml(source, file, order);

      if (!value) {
        createdOrder.status = "error";
        log(logFile, `${
          LANG["alerts"]["LE NUMERO DE COMMANDE"][lang]
         } ${order} ${
          LANG["alerts"]["N'A PAS ETE TROUVE"][lang]
         }`);
        output.log.push({
          message: `${
            LANG["alerts"]["LE NUMERO DE COMMANDE"][lang]
          } ${order} ${
            LANG["alerts"]["N'A PAS ETE TROUVE"][lang]
          }`,
          type: "error",
        });
        output.finishedOrders.push({
          order,
          success: false,
        });
        createdOrders.push(createdOrder);
        sendEmail(user?.email || "", "The following scan failed", {
          firstName: user?.firstName,
          firstLine: `The following scan failed at ${moment().format(
            "DD/MM/YYYY HH:mm:ss"
          )}`,
          secondLine: `Reason : the order number ${order} was not found in ${source}`,
          thirdLine: `Source : ${source}`,
          fourthLine: `Destination : ${destination}`,
          fifthLine: `Orders : ${orders}`,
        });
        error = true;
      } else {
        log(logFile, `${
          LANG["alerts"]["LE NUMERO DE COMMANDE"][lang]
        } ${order} ${
          LANG["alerts"]["EST TROUVE"][lang]
        }`);
        output.log.push({
          message: `${
            LANG["alerts"]["LE NUMERO DE COMMANDE"][lang]
          } ${order} ${
            LANG["alerts"]["EST TROUVE"][lang]
          }`,
          type: "info",
        });

        const success = createXmlFile(destination, order, value);
        if (!success) {
          createdOrder.status = "error";
          log(logFile, `${
            LANG["alerts"]["LE FICHIER"][lang]
          } ${order}.xml ${
            LANG["alerts"]["N'A PAS PU ETRE CREE"][lang]
          }`);
          output.log.push({
            message: `${
              LANG["alerts"]["LE FICHIER"][lang]
            } ${order}.xml ${
              LANG["alerts"]["N'A PAS PU ETRE CREE"][lang]
            }`,
            type: "error",
          });
          output.finishedOrders.push({
            order,
            success: false,
          });
          sendEmail(user?.email || "", "The following scan failed", {
            firstName: user?.firstName,
            firstLine: `The following scan failed at ${moment().format(
              "DD/MM/YYYY HH:mm:ss"
            )}`,
            secondLine: `Reason : the file ${order}.xml was not created in ${destination}`,
            thirdLine: `Source : ${source}`,
            fourthLine: `Destination : ${destination}`,
            fifthLine: `Orders : ${orders}`,
          });
          createdOrders.push(createdOrder);
        } else {
          log(logFile, `LE FICHIER ${order}.xml A ETE CREE`);
          output.log.push({
            message: `LE FICHIER ${order}.xml A ETE CREE`,
            type: "info",
          });
          output.finishedOrders.push({
            order,
            success: true,
            fileName: file,
          });
          createdOrders.push(createdOrder);
        }
      }
    }

    if (index == orders.length - 1) {
      try {
        scan = await prisma.scan.create({
          data: {
            userId: userId,
            sourceFile: source,
            destinationFile: destination,
            log: JSON.stringify(output.log),
            logFile: logFile || "",
            scheduled: false,
            finished: true,
          },
        });
        if (scan)
          await prisma.orderNumber.createMany({
            data: createdOrders.map((order) => ({
              order: order.order,
              scanId: scan.id,
              status: order.status,
              fileName: order.file,
            })),
          });
      } catch (error) {
        console.log(error);
      }
      if (!error)
        sendEmail(user?.email || "", "A scan has been finished successfully", {
          firstName: user?.firstName,
          firstLine: `A scan has been finished successfully at ${moment().format(
            "DD/MM/YYYY HH:mm:ss"
          )}`,
          secondLine: `Source : ${source}`,
          thirdLine: `Destination : ${destination}`,
          fourthLine: `log file : ${logFile}`,
          fifthLine: `Orders : ${orders}`,
        });

      res.json({
        output,
        scanId: scan?.id,
      });
    }
  });
};

const getScan = async (req, res) => {
const {lang} = req.body
  try {
    const scan = await prisma.scan.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (scan) {
      const orders = await prisma.orderNumber.findMany({
        where: {
          scanId: scan.id,
        },
      });
      const user = await prisma.user.findFirst({
        where: {
          id: scan.userId,
        },
      });
      res.json({
        scan: { ...scan, user },
        orders,
      });
    } else {
      res.json({
        scan,
        orders: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

const getAllScans = async (req, res) => {
  const {lang} = req.body
  try {
    let scans = await prisma.scan.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    scans = await Promise.all(
      scans.map(async (scan) => {
        const orders = await prisma.orderNumber.findMany({
          where: {
            scanId: scan.id,
          },
        });
        return {
          ...scan,
          orders,
        };
      })
    );
    res.json({
      scans,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: LANG["alerts"]["UNTERNAL ERROR"][lang],
    });
  }
};

const scheduleScan = async (req, res) => {
  const {lang} = req.body
  let { source, destination, logDir, orders, userId, cron } = req.body;

  let output = {
    finishedOrders: [],
    log: [],
  };

  orders = orders.filter((item, pos) => orders.indexOf(item) == pos);

  if (!source || source == "") {
    output.log.push({
      message:
        LANG["alerts"]['"VEUILLEZ CHOISIR UN REPERTOIRE DE SOURCE"'][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    return;
  }
  if (!destination || destination == "") {
    output.log.push({
      message:
        LANG["alerts"]['"VEUILLEZ CHOISIR UN REPERTOIRE DE DESTINATION"'][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    return;
  }

  if (!isDirectory(source.trim())) {
    output.log.push({
      message: LANG["alerts"]["LE REPERTOIRE DE SOURCE N'EXISTE PAS"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    sendEmail(user?.email || "", "The following scan failed", {
      firstName: user?.firstName,
      firstLine: `The following scan failed at ${moment().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      secondLine: `Reason : the source directory ${source} does not exist`,
      thirdLine: `Source : ${source}`,
      fourthLine: `Destination : ${destination}`,
      fifthLine: `Orders : ${orders}`,
    });
    return;
  }

  if (!isDirectory(destination.trim())) {
    output.log.push({
      message:
        LANG["alerts"]["LE REPERTOIRE DE DESTINATION N'EXISTE PAS"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    sendEmail(user?.email || "", "The following scan failed", {
      firstName: user?.firstName,
      firstLine: `The following scan failed at ${moment().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      secondLine: `Reason : the destination directory ${destination} does not exist`,
      thirdLine: `Source : ${source}`,
      fourthLine: `Destination : ${destination}`,
      fifthLine: `Orders : ${orders}`,
    });
    return;
  }

  if (source === destination) {
    output.log.push({
      message:
        LANG["alerts"][
          "LE REPERTOIRE DE SOURCE ET DE DESTINATION SONT IDENTIQUES"
        ][lang],
      type: "error",
    });
    res.json({
      output,
      logFile: logDir,
    });
    sendEmail(user?.email || "", "The following scan failed", {
      firstName: user?.firstName,
      firstLine: `The following scan failed at ${moment().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      secondLine: `Reason : the source and destination directories are the same`,
      thirdLine: `Source : ${source}`,
      fourthLine: `Destination : ${destination}`,
      fifthLine: `Orders : ${orders}`,
    });
    error = true;
    return;
  }

  if (!logDir || logDir?.trim() == "") logDir = destination.trim();
  else if (!isDirectory(logDir.trim())) {
    output.log.push({
      message: LANG["alerts"]["LE REPERTOIRE DE LOG N'EXISTE PAS"][lang],
      type: "error",
    });
    res.json({
      output,
    });
    error = true;
    sendEmail(user?.email || "", "The following scan failed", {
      firstName: user?.firstName,
      firstLine: `The following scan failed at ${moment().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      secondLine: `Reason : the log directory ${logDir} does not exist`,
      thirdLine: `Source : ${source}`,
      fourthLine: `Destination : ${destination}`,
      fifthLine: `Orders : ${orders}`,
    });
    return;
  }

  const logFile = createLogFile(logDir);
  if (!logFile) {
    output.log.push({
      message: LANG["alerts"]["LE REPERTOIRE DE LOG N'EXISTE PAS"][lang],
      type: "error",
    });
    res.json({
      output,
      logFile: logDir,
    });
    error = true;
    sendEmail(user?.email || "", "The following scan failed", {
      firstName: user?.firstName,
      firstLine: `The following scan failed at ${moment().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
      secondLine: `Reason : the log file could not be created`,
      thirdLine: `Source : ${source}`,
      fourthLine: `Destination : ${destination}`,
      fifthLine: `Orders : ${orders}`,
    });
    return;
  }
  output.log.push({
    message: LANG["alerts"]["DEMARRAGE DU SCAN"][lang],
    type: "info",
  });
  log(logFile, LANG["alerts"]["DEMARRAGE DU SCAN"][lang]);
  res.json({
    output,
    logFile,
  });

  const worker = new Worker("./helpers/scanWorker.js", {
    source,
    destination,
    logFile,
    orders,
    userId,
    output,
    cron,
    lang
  });

  worker.postMessage({
    source,
    destination,
    logFile,
    orders,
    userId,
    output,
    cron,
  });
  worker.on("message", (message) => {
    if (message.status == "ERROR") worker.terminate();
  });
};

module.exports = {
  createScan,
  scheduleScan,
  getScan,
  getAllScans,
};
