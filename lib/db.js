const pgp = require("pg-promise")(/* options */);
require("dotenv").config();

const password = process.env.PASSWORD;
const userName = process.env.USERNAME;
let db = pgp(`postgres://${userName}:${password}@localhost/hookie`);

const getBins = async () => {
  try {
    const sql = `
    SELECT hex_id 
    FROM bins
    `;

    const result = await db.any(sql);
    return result;
  } catch (e) {
    console.error("Error getBins: ", e);
  }
};

const createBin = async (ip, binId) => {
  console.log("createBin: ", ip, binId);
  const user = await getUserByIp(ip);
  console.log("createBin user:", user);
  try {
    const sql = `
    INSERT INTO bins (user_id, hex_id, creation_time)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    `;
    const result = await db.any(sql, [user.id, binId]);
    return result;
  } catch (e) {
    console.error("Error createBin: ", e);
  }
};

const addRequestToBin = async (payload, binId) => {
  try {
    const bin = await getBinFromHex(binId);
    const sql = `
    INSERT INTO requests (content, bin_id, request_time)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    RETURNING *
    `;

    const result = db.one(sql, [payload, bin.id]);

    return result;
  } catch (e) {
    console.error("Error addRequestToBin: ", e);
  }
};

const getBinFromHex = async (binId) => {
  try {
    const sql = `
    SELECT id
    FROM bins
    WHERE hex_id = $1
    `;

    const result = await db.one(sql, binId);
    return result;
  } catch (e) {
    console.error("Error getBinFromHex: ", e);
  }
};

const getUserByIp = async (ip) => {
  console.log("getUserByIp ", ip);
  try {
    const sql = `
    INSERT INTO users (ip)
    VALUES ($1)
    ON CONFLICT DO NOTHING;
    SELECT id
    FROM users
    WHERE ip = $1
    `;

    const result = await db.one(sql, ip);
    return result;
  } catch (e) {
    console.error("Error getUserByIp: ", e);
  }
};

const getBinsByUser = async (user) => {
  try {
    const sql = `
    SELECT hex_id
    FROM bins
    WHERE user_id = $1
    `;

    const result = await db.any(sql, user.id);
    return result;
  } catch (e) {
    console.error("Error getBinsByUser: ", e);
  }
};

const getRequests = async (binId) => {
  try {
    const sql = `
    SELECT content
    FROM requests
    INNER JOIN bins
    ON bins.id = requests.bin_id
    WHERE bins.hex_id = $1
    `;

    const result = await db.any(sql, binId);
    return result;
  } catch (e) {
    console.error("Error getRequests: ", e);
  }
};

module.exports = {
  getBins,
  createBin,
  addRequestToBin,
  getUserByIp,
  getBinsByUser,
  getRequests,
};
