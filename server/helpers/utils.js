const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });
const jsonFile = require("../workers.json");
const hbs = require("nodemailer-express-handlebars");

// Fonction de verification si un dossier est existant ou non
// dir @String : chemin du dossier
const isDirectory = (dir) => {
  try {
    fs.readdirSync(dir);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Fonction De Récuperation des lignes d'un fichier XML dans le dossier source à partir d'un numéro de commande
// source @String : chemin du dossier source
// file @String : nom du fichier
// order @String : numéro de commande
const extractLineFromXml = (source, file, order) => {
  try {
    file = path.join(source, file);
    let value = "";
    const xml = fs.readFileSync(file, "utf8");
    const lines = xml.split("\n");
    value += lines.find((line) =>
      line.startsWith(`<aroma_order:DeliveryExport`)
    );
    value += lines.find((line) => line.includes(`>${order}<`));
    return `${value}\n </aroma_order:DeliveryExport>`;
  } catch (error) {
    return null;
  }
};

// Fonction de création d'un fichier XML
// destination @String : chemin du dossier destination
// order @String : numéro de commande
// value @String : contenu du fichier
const createXmlFile = (destination, order, value) => {
  try {
    fs.writeFileSync(path.join(destination, `${order}.xml`), value);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Fonction pour l'ajout d'un message dans le fichier de log
// file @String : chemin du fichier de log
// message @String : message à ajouter
const log = (file, message) => {
  try {
    fs.appendFileSync(file, formatLogMessage(message).toUpperCase());
  } catch (error) {
    console.error(error);
  }
};

// Fonction de formatage du message de log sous forme de : [date] : [message]
// message @String : message à formater
const formatLogMessage = (message) => {
  return `[${new Date().getUTCFullYear()}:${
    new Date().getUTCMonth().toString().length == 1
      ? "0" + new Date().getUTCMonth()
      : new Date().getUTCMonth()
  }:${
    new Date().getUTCDay().toString().length == 1
      ? "0" + new Date().getUTCDay()
      : new Date().getUTCDay()
  }:${
    new Date().getUTCHours().toString().length == 1
      ? "0" + new Date().getUTCHours()
      : new Date().getUTCHours()
  }:${
    new Date().getUTCMinutes().toString().length == 1
      ? "0" + new Date().getUTCMinutes()
      : new Date().getUTCMinutes()
  }:${
    new Date().getUTCSeconds().toString().length == 1
      ? "0" + new Date().getUTCSeconds()
      : new Date().getUTCSeconds()
  }] : ${message}\n`;
};

// Fonction de création d'un fichier de log dans un dossier
// dir @String : chemin du dossier
const createLogFile = (dir) => {
  try {
    const filename = path.join(
      dir,
      new Date().toISOString().replace(/:/g, "") + ".log"
    );
    fs.writeFileSync(filename, "");
    return filename;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const sendEmail = (email, subject, context) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    // text: message,
    template: "email.template",
    context,
  };

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
  };

  transporter.use("compile", hbs(handlebarOptions));

  transporter.sendMail(mailOptions, (error) => {
    if (error) console.log(error);
    else console.log("EMAIL SENT");
  });
};

const saveWorker = async (file, data) => {
  let workers = jsonFile.workers;
  workers.push({
    date: new Date().toISOString().replace(/:/g, ""),
    file,
    data,
    status: "RUNNING",
  });
  // write workers to file
  fs.writeFileSync(
    path.join(__dirname, "../workers.json"),
    JSON.stringify({ workers })
  );
};

const scanSuccess = (scan) => {
  if (scan) {
    let log = JSON.parse(scan.log);
    for (let i = 0; i < log.length; i++)
      if (log[i].type === "error") return false;
    return true;
  } else return false;
};

const generatePassword = () => {
  let length = 8,
    charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&é-è_çà)=ù#",
    pwd = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    pwd += charset.charAt(Math.floor(Math.random() * n));
  }
  return pwd;
};

module.exports = {
  isDirectory,
  extractLineFromXml,
  createXmlFile,
  log,
  createLogFile,
  sendEmail,
  saveWorker,
  scanSuccess,
  generatePassword,
};
