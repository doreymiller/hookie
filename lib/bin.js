const db = require("./db.js");

const genRandomHex = (hexSize) => {
  let randomHex = [...Array(hexSize)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
  return randomHex;
};

const getExistingBinIds = async () => {
  const existingBins = await db.getBins();
  const existingBinIds = {};

  existingBins.forEach((bin) => (existingBinIds[bin.id] = true));

  return existingBins;
};

const getNewBinId = async () => {
  const hexSize = 8;
  const genNewBinId = () => {
    return genRandomHex(hexSize);
  };

  const existingBinIds = await getExistingBinIds();
  let newBinId = genNewBinId();

  while (existingBinIds[newBinId]) {
    newBinId = genNewBinId();
  }

  console.log("getNewBinId ", newBinId);
  return newBinId;
};

module.exports = {
  getNewBinId,
};
