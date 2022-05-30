const { PrismaClient } = require("@prisma/client");
const { parentPort } = require("worker_threads");
const { searchForXmlFile } = require("./thread");
const { extractLineFromXml, log, sendEmail } = require("./utils");
const cron = require("node-cron");
const moment = require("moment");
const LANG = require("../../i18n/lang.json");

const prisma = new PrismaClient();
console.log("SCAN WORKER STARTED");

let errOccurred = false;

parentPort.on("message", async (data) => {
  const {
    orders,
    logFile,
    source,
    destination,
    userId,
    output,
    cron: cronExp,
    lang,
  } = data;

  cron.schedule(cronExp, (date) => {
    if (errOccurred) {
      parentPort.postMessage({ status: "ERROR" });
    } else
      scan(orders, logFile, source, destination, userId, output, cronExp, lang);
  });
});

const scan = async (
  orders,
  logFile,
  source,
  destination,
  userId,
  output,
  lang
) => {
  let createdOrders = [];
  let createdScan = null;
  const user = await prisma.user.findFirst({ where: { id: userId } });

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
      errOccurred = true;
      createdOrders.push(createdOrder);
      sendEmail(user?.email || "", "The following scan failed", {
        firstName: user?.firstName,
        firstLine: `The following scan failed at ${moment().format(
          "DD/MM/YYYY HH:mm:ss"
        )}`,
        secondLine: `Reason : the order ${order} was not found`,
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
        log(
          logFile,
          `${LANG["alerts"]["LE NUMERO DE COMMANDE"][lang]} ${order} ${LANG["alerts"]["N'A PAS ETE TROUVE"][lang]}`
        );
        output.log.push({
          message: `${LANG["alerts"]["LE NUMERO DE COMMANDE"][lang]} ${order} ${LANG["alerts"]["N'A PAS ETE TROUVE"][lang]}`,
          type: "error",
        });
        output.finishedOrders.push({
          order,
          success: false,
        });
        errOccurred = true;
        sendEmail(user?.email || "", "The following scan failed", {
          firstName: user?.firstName,
          firstLine: `The following scan failed at ${moment().format(
            "DD/MM/YYYY HH:mm:ss"
          )}`,
          secondLine: `Reason : the order ${order} was not found`,
          thirdLine: `Source : ${source}`,
          fourthLine: `Destination : ${destination}`,
          fifthLine: `Orders : ${orders}`,
        });
        createdOrders.push(createdOrder);
      } else {
        log(logFile, `LE NUMERO DE COMMANDE ${order} EST TROUVE`);
        output.log.push({
          message: `LE NUMERO DE COMMANDE ${order} EST TROUVE`,
          type: "info",
        });

        const success = createXmlFile(destination, order, value);
        if (!success) {
          createdOrder.status = "error";
          log(
            logFile,
            `${LANG["alerts"]["LE FICHIER"][lang]} ${order}.xml ${LANG["alerts"]["N'A PAS ETE CREER"][lang]}`
          );
          output.log.push({
            message: `${LANG["alerts"]["LE FICHIER"][lang]} ${order}.xml ${LANG["alerts"]["N'A PAS ETE CREER"][lang]}`,
            type: "error",
          });
          output.finishedOrders.push({
            order,
            success: false,
          });
          errOccurred = true;
          sendEmail(user?.email || "", "The following scan failed", {
            firstName: user?.firstName,
            firstLine: `The following scan failed at ${moment().format(
              "DD/MM/YYYY HH:mm:ss"
            )}`,
            secondLine: `Reason : the order ${order} was not found`,
            thirdLine: `Source : ${source}`,
            fourthLine: `Destination : ${destination}`,
            fifthLine: `Orders : ${orders}`,
          });
          createdOrders.push(createdOrder);
        } else {
          log(
            logFile,
            `${LANG["alerts"]["LE FICHIER"][lang]} ${order}.xml ${LANG["alerts"]["A ETE CREE"][lang]}`
          );
          output.log.push({
            message: `${LANG["alerts"]["LE FICHIER"][lang]} ${order}.xml ${LANG["alerts"]["A ETE CREE"][lang]}`,
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
      createdScan = await prisma.scan.create({
        data: {
          userId: userId,
          sourceFile: source,
          destinationFile: destination,
          log: JSON.stringify(output.log),
          logFile: logFile || "",
          scheduled: true,
          finished: false,
        },
      });
      if (createdScan)
        await prisma.orderNumber.createMany({
          data: createdOrders.map((order) => ({
            order: order.order,
            scanId: createdScan.id,
            status: order.status,
            fileName: order.file,
          })),
        });
      if (!errOccurred)
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
    }
  });
};
