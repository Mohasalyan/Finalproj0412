const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const Product = require("../models/Product");
const createError = require("../utils/createError");
const { sendNotificationToUser } = require("../utils/notifications");
const Notification = require("../models/Notifications");

const createProduct = async (req, res, next) => {
  try {
    const { name, status, price, category, option, tips, color } = req.body;

    if (!name || !status || !price || !option || !category) {
      return next(createError("All fields are required.", 400));
    }

    if (req.user.role !== "seller") {
      return next(
        createError("You don't have permission to create a product.", 403)
      );
    }

    const newProduct = new Product({
      name,
      status,
      price,
      category,
      user: req.user._id,
      option,
      tips,
      color,
    });

    if (req.files?.image?.length > 0) {
      newProduct.image = req.files?.image[0]?.filename;
    }

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    if (error.code === 11000 || error.name === "MongoError") {
      return next(createError(error.message, 400));
    } else {
      next(error);
    }
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { name, category, seller, limit } = req.query;

    const query = {};
    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }
    if (category) {
      query.category = category;
    }
    if (seller) {
      query.user = seller;
    }

    const defaultLimit = limit ? parseInt(limit, 10) : Infinity;

    const products = await Product.find(query)
      .populate("category")
      .select("-matchRequests")
      .sort({ createdAt: -1 })
      .limit(defaultLimit);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getAllProductNames = async (req, res, next) => {
  try {
    const productNames = await Product.find().distinct("name");
    res.status(200).json(productNames);
  } catch (error) {
    next(error);
  }
};

const getMatchRequestsBySeller = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const matchRequests = await Product.aggregate([
      {
        $match: {
          user: sellerId,
        },
      },
      {
        $unwind: "$matchRequests",
      },
      {
        $lookup: {
          from: "users",
          localField: "matchRequests.sender",
          foreignField: "_id",
          as: "senderInfo",
        },
      },
      {
        $project: {
          _id: 0,
          _id: "$matchRequests._id",
          productId: "$_id",
          productName: "$name",
          sender: {
            _id: "$matchRequests.sender",
            username: { $arrayElemAt: ["$senderInfo.username", 0] },
          },
          status: "$matchRequests.status",
        },
      },
    ]);

    res.status(200).json(matchRequests);
  } catch (error) {
    next(error);
  }
};

const getMyProducts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const products = await Product.find({ user: userId }).populate("category");

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductByIdForGuest = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return next(createError("Product not found.", 404));
    }

    await product.populate("user");
    await product.populate("category");
    const productRes = {
      _id: product._id,
      name: product.name,
      status: product.status,
      price: product.price,
      color: product.color,
      category: product.category,
      user: product.user,
      option: product.option,
      tips: product.tips,
      matchRequests: [],
      image: product.image,
      isChatEnabled: false,
    };

    res.status(200).json(productRes);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.params.userId;
    const product = await Product.findById(productId);

    if (!product) {
      return next(createError("Product not found.", 404));
    }

    const userMatchRequest = product.matchRequests.find(
      (request) => request.sender.toString() === userId.toString()
    );
    const isChatEnabled =
      userMatchRequest && userMatchRequest.status === "accepted";

    await product.populate("user");
    await product.populate("category");
    const productRes = {
      _id: product._id,
      name: product.name,
      status: product.status,
      price: product.price,
      color: product.color,
      category: product.category,
      user: product.user,
      option: product.option,
      tips: product.tips,
      matchRequests: product.matchRequests,
      image: product.image,
      isChatEnabled,
    };

    res.status(200).json(productRes);
  } catch (error) {
    next(error);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...req.body, user: req.user._id },
      { new: true }
    );

    if (!updatedProduct) {
      return next(createError("Product not found.", 404));
    }
    if (req.files?.image?.length > 0) {
      updatedProduct.image = req.files?.image[0]?.filename;
    }
    await updatedProduct.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await Product.findById(productId); 

    if (!product) {
      return next(createError("Product not found.", 404));
    }

    if (product.user.toString() !== userId) {
      return next(
        createError("You are not authorized to delete this product.", 403)
      );
    }

    await Chat.deleteMany({ product: productId });
    await Notification.deleteMany({ product: productId });
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return next(createError("Product not found.", 404));
    }

    res.status(201).send(deletedProduct);
  } catch (error) {
    next(error);
  }
};

const sendMatchRequest = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return next(createError("Product not found.", 404));
    }
    if (product.user.toString() === req.user._id.toString()) {
      return next(
        createError("Cannot send match request to own product.", 400)
      );
    }

    const existingMatchRequest = product.matchRequests.find(
      (request) => request.sender.toString() === req.user._id.toString()
    );

    if (existingMatchRequest) {
      return next(
        createError("Match request already sent for this product.", 400)
      );
    }

    product.matchRequests.push({
      sender: req.user._id,
      status: "pending",
    });
    sendNotificationToUser({
      type: "matchReq",
      product: product._id,
      recipient: product.user,
      sender: req.user._id,
      body: `${req.user.username} send you a match request for ${product.name} product`,
    });
    await product.save();

    res.status(201).json({ message: "Match request sent successfully." });
  } catch (error) {
    next(error);
  }
};

const handleMatchRequest = async (req, res, next) => {
  try {
    const { productId, requestId } = req.params;
    const { action } = req.body;

    const product = await Product.findById(productId).populate(
      "matchRequests.sender"
    );
    if (!product) {
      return next(createError("Product not found.", 404));
    }

    const matchRequest = product.matchRequests.id(requestId);
    if (!matchRequest) {
      return next(createError("Match request not found.", 404));
    }

    if (product.user.toString() !== req.user._id.toString()) {
      return next(
        createError("Unauthorized to handle this match request.", 403)
      );
    }

    let chatRoom;

    const existingChat = await Chat.findOne({
      product: product._id,
      participants: { $all: [req.user._id, matchRequest.sender] },
    });

    if (existingChat) {
      chatRoom = existingChat;
    } else {
      chatRoom = new Chat({
        product: product._id,
        participants: [req.user._id, matchRequest.sender],
      });

      await chatRoom.save();
    }

    if (action === "accept") {
      matchRequest.status = "accepted";
    } else if (action === "reject") {
      matchRequest.status = "rejected";
    } else {
      return next(createError("Invalid action.", 400));
    }

    await product.save();
    const updatedMatchRequest = {
      _id: matchRequest._id,
      productId: product._id,
      productName: product.name,
      sender: {
        _id: matchRequest.sender._id,
        username: matchRequest.sender.username,
      },
      status: matchRequest.status,
    };

    sendNotificationToUser({
      type: "matchReq",
      product: product._id,
      matchRequest: matchRequest._id,
      recipient: matchRequest.sender,
      sender: req.user._id,
      body: `${req.user.username} Accepted your match request for ${product.name} product`,
    });

    res.status(200).json({
      updatedMatchRequest,
      message: `Match request ${action}ed successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

const getMostRequestedProducts = async (req, res, next) => {
  try {
    const sellerId = req.params.sellerId;

    const products = await Product.find({
      user: sellerId,
      matchRequests: { $exists: true, $ne: [] },
    }).populate("category");

    const sortedProducts = products.sort(
      (a, b) => b.matchRequests.length - a.matchRequests.length
    );

    const mostRequestedProducts = sortedProducts.slice(0, 10);

    res.status(200).json(mostRequestedProducts);
  } catch (error) {
    next(error);
  }
};

// For development
const deleteProducts = async (req, res, next) => {
  try {
    const product = await Product.deleteMany();
    res.status(201).send("Deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  sendMatchRequest,
  handleMatchRequest,
  getMatchRequestsBySeller,
  getAllProductNames,
  getMostRequestedProducts,
  getProductByIdForGuest,
  // For development
  deleteProducts,
};
