// const { Server } = require("socket.io");
// const authinticateSocket = require("./middlewares/wsAuthinticate");

// const WS = new Server({
//   cors: { origin: "http://localhost:5001" },
//   path: "/ws",
// });
// WS.on("connection", (socket) => {});
// WS.of("/clients")
//   .use(authinticateSocket())
//   .on("connection", (socket) => {
//     socket.emit("welcome", `Welcome Back ${socket.user.fullName}`);
//   });
// module.exports = WS;

// wsServer.js

const { Server } = require("socket.io");
const authinticateSocket = require("./middlewares/wsAuthinticate");
const Chat = require("./models/Chat");
const createError = require("./utils/createError");
const mongoose = require("mongoose");  // Correct import

const WS = new Server({
  cors: { origin: "http://localhost:5001" },
  path: "/ws",
});

WS.of("/clients")
  .use(authinticateSocket())
  .on("connection", (socket) => {
    socket.emit("welcome", `Welcome Back ${socket.user.fullName}`);

    // Join user to their room (using user ID as the room ID)
    // socket.on("sendMessage", async ({ chatId, text }) => {
    //   // console.log("sendMsgEv",mongoose.Types.ObjectId(chatId));
    //   try {
    //     const chat = await Chat.findOne({_id:chatId});

    //     if (!chat) {
    //       throw createError("Chat not found",404);
    //     }

    //     // Check if the user is a participant in the chat
    //     if (!chat.participants.includes(socket.user.id)) {
    //       throw createError("You are not a participant in this chat",403);
    //     }

    //     // Add the new message
    //     chat.messages.push({ sender: socket.user.id, text });

    //     await chat.save();
    //     // console.log({ socket });
    //     // Broadcast the new message to all participants
    //     const participants1 = socket.user.id
    //     const participants2 = chat.participants.find(item => item._id !== socket.user.id)._id
    //     console.log(`Emitting newMessage event to participants: ${participants1} and ${participants2}`);

    //     socket.to(participants2).emit("newMessage", "HHHHH");
    //     // {
    //     //   chatId: chat._id,
    //     //   sender: socket.user,
    //     //   text,
    //     // }
    //   } catch (error) {
    //     console.log(error.message)
    //     socket.emit("error", error.message);
    //   }
    // });
  });

module.exports = WS;
