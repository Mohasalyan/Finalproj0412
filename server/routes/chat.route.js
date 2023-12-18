// chatRoutes.js

const express = require("express");
const chatController = require("../controllers/chat.controller");
const Auhinticate = require("../middlewares/auhinticate");
const chatRouter = express.Router();

// POST /api/chat
chatRouter.post("/", Auhinticate(), chatController.createChat);
chatRouter.get("/", Auhinticate(), chatController.getChats);
chatRouter.get("/my-chats", Auhinticate(), chatController.getMyChats);
chatRouter.post("/:chatId", Auhinticate(), chatController.sendMessage);
chatRouter.get("/:productId", Auhinticate(), chatController.getChatByID);
chatRouter.delete("/", Auhinticate(), chatController.deleteChats);

module.exports = chatRouter;