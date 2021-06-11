const responses = document.getElementById("responses");
const socket = io();

const bin = document.getElementById("bin").dataset.bin;
socket.emit("bin", bin);
socket.on("msg", (msg) => {
  console.log("received message", msg);
  const requestItem = document.createElement("li");
  requestItem.textContent = msg.request_time;
  const requestHeaders = document.createElement("ul");
  requestHeaders.className = "request-headers";

  const mapKeyValue = (obj) => {
    let keys = Object.keys(obj);
    return keys.map((k) => `<li>${k}:${obj[k]}</li>`);
  };
  const reqHeaderItems = mapKeyValue(msg.content);
  console.log("reqHeaderItems: ", reqHeaderItems);
  reqHeaderItems.innerHTML = reqHeaderItems.join("");
  requestItem.appendChild(requestHeaders);
  responses.appendChild(requestItem);
  window.scrollTo(0, document.body.scrollHeight);
});
