const { PrismaClient } = require("@prisma/client");
const { parentPort } = require("worker_threads");
const { searchForXmlFile } = require("./thread");
const { extractLineFromXml , log } = require("./utils");
const cron = require("node-cron");

const prisma = new PrismaClient();

let executionCount = 0;
console.log("SCAN WORKER STARTED");

parentPort.on("message", async (data) => {
 
  const {
    orders,
    logFile,
    source,
    destination,
    userId,
    output,
    cron: cronExp,
  } = data;
console.log(cronExp);
  cron.schedule(cronExp, (date) => {
    console.log(date);
    scan(orders, logFile, source, destination, userId, output, cronExp);
    executionCount++;
  });
});

const scan = (orders, logFile, source, destination, userId, output) => {
  let createdOrders = [];
console.log(logFile);
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
        createdScan = await prisma.scan.create({
          data: {
            userId: userId,
            sourceFile: source,
            destinationFile: destination,
            log: JSON.stringify(output.log),
            logFile: logFile || "",
            scheduled : true,
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
      } catch (error) {
        console.log(error);
      }
    }
  });
};
