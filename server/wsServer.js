const { Server } = require("socket.io");
const authinticateSocket = require("./middlewares/wsAuthinticate");
const Chat = require("./models/Chat");
const mongoose = require("mongoose"); 

const WS = new Server({
  cors: { origin: ["http://localhost:5001", "https://swap-moq.vercel.app"] },
  path: "/ws",
});

WS.of("/clients")
  .use(authinticateSocket())
  .on("connection", (socket) => {
    socket.emit("welcome", `Welcome Back ${socket.user.fullName}`);
  });

module.exports = WS;
