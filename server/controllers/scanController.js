const { PrismaClient } = require("@prisma/client");
const { searchForXmlFile } = require("../helpers/thread");
const {
  isDirectory,
  createLogFile,
  log,
  createXmlFile,
  extractLineFromXml,
} = require("../helpers/utils");

const prisma = new PrismaClient();
const createScan = async (req, res) => {

  let { source, destination, logDir, orders, userId } = req.body;

  let output = {
    finishedOrders: [],
    log: [],
  };
  let error = false;

  let createdOrders = [];


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
    return;
  }

  if (orders.length == 0 || !orders[0]) {
    output.log.push({
      message: "VEUILLEZ CHOISIR AU MOINS UNE COMMANDE",
      type: "error",
    });
    res.json({
      output,
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
    res.json({
      output,
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
    if (index == orders.length - 1 && !error) {
      try {
        const scan = await prisma.scan.create({
          data: {
            userId: userId,
            sourceFile: source,
            destinationFile: destination,
            log: JSON.stringify(output.log),
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

      res.json({
        output,
      });
    }
  });
};

module.exports = {
  createScan,
};
