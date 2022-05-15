const fs = require("fs");

// Evenement de réception des fichiers XML
process.on("message", (data) => {
  for (let i = 0; i < sortFiles(data.source, data.files).length; i++) {
    // Lecture du fichier XML
    const file = fs.readFileSync(`${data.source}/${data.files[i]}`, "utf8");
    // Si le fichier inclus
    if (file.includes(`>${data.order}<`)) process.send(data.files[i]);
    else process.send(null);
    process.exit(0);
  }
});

// Fonction de tri des fichiers XML par la date de modification
// dir @String : chemin du dossier contenant les fichiiers
const sortFiles = (dir ,files) => {
  try {
    const sortedFiles = files.sort(
      (file, file2) =>
        fs.statSync(`${dir}\\${file2}`).atime.getTime() -
        fs.statSync(`${dir}\\${file}`).atime.getTime()
    );
    return sortedFiles;
  } catch (error) {
    console.error(error);
    return null;
  }
};