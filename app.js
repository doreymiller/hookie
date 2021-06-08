const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const expressHandlebars = require("express-handlebars");

const bin = require("./lib/bin.js");
const db = require("./lib/db");

const port = process.env.PORT || 3000;

io.on("connect", (socket) => {
  console.log("connected");
});

app.get("/", (req, res) => {
  res.send("hookie");
});

app.get("/createBin", async (req, res) => {
  const ip = req.socket.address().address;

  console.log("user ip: ", ip);
  const newBinId = await bin.getNewBinId();
  const result = await db.createBin(ip, newBinId);
  console.log("testing newBinId " + newBinId);
  console.log("db result: ", result);
  console.log("create a request bin and return and add to database");
});

app.get("/bin/:binId", async (req, res) => {
  const binId = req.params.binId;
  const payload = JSON.stringify(req.headers);
  const data = await db.addRequestToBin(payload, binId);

  io.to(binId).emit("msg", data["content"]);

  res.type("application/json");
  res.send(data["content"]);

  console.log("sending data: ", data);
});

http.listen(port, () => {
  console.log("listening on port " + port);
});
