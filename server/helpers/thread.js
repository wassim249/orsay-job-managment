const fs = require("fs");
const { fork } = require("child_process");

const searchForXmlFile = (source, order) => {
  try {
    let files = fs.readdirSync(source);
    let file = null;
    let childs = [];
    for (let i = 0; i < 10; i++) childs.push(fork("./helpers/child.js"));

    let chunks = [];
    for (let i = 0; i < files.length; i++) {
      if (i % childs.length === 0) chunks.push([]);
      chunks[chunks.length - 1].push(files[i]);
    }
    let counter = 0;
    return new Promise((resolve, reject) => {
      childs.forEach((child, index) => {
        child.send({
          source,
          files: chunks[index],
          order,
        });
        child.on("message", (data) => {
          counter++;
          file = data;
          if (file) {
            childs.forEach((child) => child.kill());
            resolve(file);
          } else if (counter === childs.length) {
            childs.forEach((child) => child.kill());
            resolve(null);
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.searchForXmlFile = searchForXmlFile;
