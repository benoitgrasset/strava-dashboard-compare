import fs from "fs-extra";

export const readJSON = (jsonFile) => {
  let json;
  fs.readFile(jsonFile, (err, data) => {
    if (err) throw err;
    json = JSON.parse(data);
  });
  return json;
};

export const writeJSON = (jsonFile, json) => {
  fs.writeFile(jsonFile, json, function (err) {
    if (err) throw err;
    console.log(`write to ${jsonFile} complete`);
  });
};
