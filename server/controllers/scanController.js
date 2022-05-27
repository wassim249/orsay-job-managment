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
      message: "VEUILLEZ CHOISIR UN REPERTOIRE DE SOURCE",
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
      message: "VEUILLEZ CHOISIR UN REPERTOIRE DE DESTINATION",
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
      message: "REPERTOIRE DE SOURCE INEXISTANT",
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
      message: "REPERTOIRE DE DESTINATION INEXISTANT",
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
      message: "REPERTOIRE DE SOURCE ET DESTINATION SONT IDENTIQUES",
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
      message: "REPERTOIRE DE LOG INEXISTANT",
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
      message: "ERREUR LORS DE LA CREATION DU FICHIER DE LOG",
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
    log(logFile, `AU COURS DE RECHERCHE DE LA COMMANDE : ${order}`);
    output.log.push({
      message: `AU COURS DE RECHERCHE DE LA COMMANDE : ${order}`,
      type: "info",
    });

    const file = await searchForXmlFile(source, order);
    if (!file) {
      createdOrder.status = "error";
      log(logFile, `LA COMMANDE ${order} N'A PAS ETE TROUVEE`);
      output.log.push({
        message: `LA COMMANDE ${order} N'A PAS ETE TROUVEE`,
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
        log(logFile, `LE NUMERO DE COMMANDE ${order} N'A PAS ETE TROUVE`);
        output.log.push({
          message: `LE NUMERO DE COMMANDE ${order} N'A PAS ETE TROUVE`,
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
      } else {
        log(logFile, `LE NUMERO DE COMMANDE ${order} EST TROUVE`);
        output.log.push({
          message: `LE NUMERO DE COMMANDE ${order} EST TROUVE`,
          type: "info",
        });

        const success = createXmlFile(destination, order, value);
        if (!success) {
          createdOrder.status = "error";
          log(logFile, `LE FICHIER ${order}.xml N'A PAS PU ETRE CREE`);
          output.log.push({
            message: `LE FICHIER ${order}.xml N'A PAS PU ETRE CREE`,
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
    if (index == orders.length - 1 && !error) {
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
      message: "UNTERNAL ERROR",
    });
  }
};

const getAllScans = async (req, res) => {
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
      message: "UNTERNAL ERROR",
    });
  }
};

const scheduleScan = async (req, res) => {
  let { source, destination, logDir, orders, userId, cron } = req.body;

  let output = {
    finishedOrders: [],
    log: [],
  };

  orders = orders.filter((item, pos) => orders.indexOf(item) == pos);

  if (!source || source == "") {
    output.log.push({
      message: "VEUILLEZ CHOISIR UN REPERTOIRE DE SOURCE",
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
      message: "VEUILLEZ CHOISIR UN REPERTOIRE DE DESTINATION",
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
      message: "REPERTOIRE DE SOURCE INEXISTANT",
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
      message: "REPERTOIRE DE DESTINATION INEXISTANT",
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
      message: "REPERTOIRE DE SOURCE ET DESTINATION SONT IDENTIQUES",
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
      message: "DOSSIER DE LOG INEXISTANT",
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
      message: "ERREUR LORS DE LA CREATION DU FICHIER DE LOG",
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
    message: `DEMARRAGE DU SCAN`,
    type: "info",
  });
  log(logFile, `DEMARRAGE DU SCAN`);
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
