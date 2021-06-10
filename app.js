const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const expressHandlebars = require("express-handlebars");

const bin = require("./lib/bin.js");
const db = require("./lib/db");

const port = process.env.PORT || 3000;

app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("bin", (bin) => {
    socket.join(bin);
  });
});

app.get("/", async (req, res) => {
  const ip = getIp(req);
  const user = await db.getUserByIp(ip);
  const userBins = await db.getBinsByUser(user);
  const userBinIds = userBins.map((bin) => bin.hex_id);

  res.render("home", {
    bins: userBinIds,
  });
});

app.get("/newBin", async (req, res) => {
  const ip = getIp(req);
  const newBinId = await bin.getNewBinId();
  const result = await db.createBin(ip, newBinId);

  res.redirect(302, `/bin/${newBinId}/inspect`);
});

app.get("/bin/:binId/inspect", async (req, res) => {
  const data = await db.getRequests(req.params.binId);

  const mapKeyValue = (obj) => {
    let keys = Object.keys(obj);
    return keys.map((k) => `${k}:${obj[k]}`);
  };
  const requests = data.map((d) => mapKeyValue(d.content));

  res.render("bin", {
    binUrl: `${req.baseUrl}/${req.params.binId}`,
    binId: req.params.binId,
    requests,
  });
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

const getIp = (req) => {
  return req.socket.address().address;
};

http.listen(port, () => {
  console.log("listening on port " + port);
});
