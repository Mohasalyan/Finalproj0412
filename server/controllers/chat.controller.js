const Product = require("../models/Product.js");
const Chat = require("../models/Chat.js");
const createError = require("../utils/createError.js");
const WS = require("../wsServer");
const { sendNotificationToUser } = require("../utils/notifications.js");

// chatController.js

const createChat = async (req, res) => {
  try {
    const { productId, message } = req.body;

    const product = await Product.findById(productId).populate("user");

    if (!product) {
      return next(createError("Product not found.", 404));
    }

    // Check if there is an accepted match request
    const acceptedMatchRequest = product.matchRequests.find(
      (request) => request.status === "accepted"
    );

    if (!acceptedMatchRequest) {
      return next(
        createError("No accepted match request found for this product", 400)
      );
    }

    // Create the chat logic
    const chat = await Chat.create({
      product: productId,
      participants: [req.user._id, product.user._id],
      messages: [{ sender: req.user._id, text: message }],
    });

    // Emit a real-time update using Socket.io
    const recipientSocket = WS.of("/clients").sockets.get(
      String(product.user._id)
    );
    if (recipientSocket) {
      recipientSocket.emit("newMessage", {
        chatId: chat._id,
        sender: req.user,
        text: message,
      });
    }

    res
      .status(200)
      .json({ message: "Chat created successfully", chatId: chat._id });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
const getMyChats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all chats where the user is a participant
    const userChats = await Chat.find({
      participants: userId,
    })
      .populate("product", "name")
      .populate("participants", "username photo");

    res.status(200).json(userChats);
  } catch (error) {
    next(error);
  }
};

const getChatByID = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const chat = await Chat.findOne({ product: productId });
    if (!chat) {
      return next(createError("Chat not found!", 404));
    }
    await chat.populate("product");
    await chat.populate("participants");
    chat.isNewMsg = false;
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find()
      .populate("product")
      .populate("participants");
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    const chat = await Chat.findById(chatId).populate("product");
    if (!chat) {
      return next(createError("Chat not found.", 404));
    }

    // Check if the user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      return next(createError("You are not a participant in this chat", 403));
    }

    // Add the new message
    chat.messages.push({ sender: req.user._id, text });
    chat.isNewMsg = true;
    await chat.save();

    // Emit the new message to all participants in the chat
    const participants = chat.participants.map((participant) =>
      String(participant)
    );
    WS.of("/clients").sockets.forEach((socket) => {
      if (participants.includes(socket.user.id)) {
        socket.emit("newMessage", {
          sender: req.user._id,
          text,
        });
      }
    });
    sendNotificationToUser({
      type: "message",
      recipient: participants.find((item) => item != req.user._id),
      product: chat.product._id,
      sender: req.user._id,
      body: `${req.user.username} send you a new message, related to ${chat.product.name}`,
    });
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
const deleteChats = async (req, res, next) => {
  try {
    await Chat.deleteMany();
    res.status(200).json("deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChat,
  getChats,
  deleteChats,
  getChatByID,
  sendMessage,
  getMyChats,
};
