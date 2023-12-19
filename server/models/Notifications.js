const { Schema, model, default: mongoose } = require("mongoose");

const WS = require("../wsServer");
const notificationSchema = new Schema(
  {
    recipient: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["message","user", "matchReq", "public"],
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    matchRequest: {
      type: mongoose.Types.ObjectId,
    },
    seen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
notificationSchema.pre("save", async function (next) {
  this.wasNew = this.isNew;
  next();
});

notificationSchema.post("save", async function (notification, next) {
  try {
    if (notification.wasNew) {
      const recipient = notification.recipient;
      WS.of("/clients").sockets.forEach((socket) => {
        if (recipient.toString() === socket.user.id) {
          socket.emit("notification", notification);
        }
      });
    }
  } catch (err) {}
});
const Notification = model("Notification", notificationSchema);

module.exports = Notification;
