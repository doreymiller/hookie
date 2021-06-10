const responses = document.getElementById("responses");
const socket = io();
console.log("socket ", socket);

const bin = document.getElementById("bin").dataset.bin;
socket.emit("bin", bin);
socket.on("msg", (msg) => {
  console.log("received message", msg);
  let item = document.createElement("li");
  const mapKeyValue = (obj) => {
    let keys = Object.keys(obj);
    return keys.map((k) => `${k}:${obj[k]}`);
  };
  const requests = mapKeyValue(msg);
  item.innerHTML = requests; //ADD HANDLEBARS REQUEST PARTIAL
  // item.innerHTML = Object.entries(JSON.parse(msg)).map(
  //   ([key, value]) => `<b>${key}:</b> ${value}<br>`
  // );
  responses.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
