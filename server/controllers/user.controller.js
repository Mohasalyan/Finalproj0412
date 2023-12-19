const { CatchAsyncError } = require("../middlewares/CatchAsyncError.js");
const User = require("../models/User.js");
const createError = require("../utils/createError.js");
const { sendNotificationToUser } = require("../utils/notifications");

const register = CatchAsyncError(async (req, res) => {
  const { username, fullName, email, password, role } = req.body;
  if (!fullName) {
    return res.status(400).json({ message: "fullName is required" });
  }
  if (await User.findOne({ username })) {
    return res.status(400).json({ message: "username already in use" });
  }

  try {
    const user = new User({
      username,
      fullName,
      email,
      password,
      role,
    });
    if (req.files?.image?.length > 0) {
      user.photo = req.files?.image[0]?.filename;
    }
    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const login = CatchAsyncError(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required!" });
  }
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid Username or Password!" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Username or Password!" });
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message, error: error });
  }
});
const myProfile = CatchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).populate("reviews.user");
    if (!user) {
      return next(createError("user not found!"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
const getUserById = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("reviews.user");
    if (!user) {
      return next(createError("user not found!"));
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
});
const updateProfile = CatchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const keys = ["username", "fullName"];
  try {
    const user = await User.findById(_id);
    if (!user) {
      return next(createError("user not found!", 404));
    }
    Object.keys(req.body).forEach((key) => {
      if (keys.includes(key)) user[key] = req.body[key];
    });
    await user.validate();
    if (req.files && req.files["image"]) {
      user.photo = req.files?.image[0]?.filename;
    }

    await user.save();
    res.send(user);
  } catch (error) {
    if (error.code === 11000 || error.name === "MongoError") {
      return next(createError("Email already in use", 400));
    } else {
      next(error);
    }
  }
});
const createSellerRating = CatchAsyncError(async (req, res) => {
  const { sellerId, rating, comment } = req.body;
  const buyerId = req.user._id;
  try {
    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }
    const existingReviewIndex = seller.reviews.findIndex(
      (review) => String(review.user) === String(buyerId)
    );
    if (existingReviewIndex !== -1) {
      // Update the existing review
      seller.reviews[existingReviewIndex].rating = rating;
      seller.reviews[existingReviewIndex].comment = comment;
    } else {
      // Create a new review
      seller.reviews.push({
        user: buyerId,
        rating,
        comment,
      });
    }
    await seller.save();

    const totalRating = seller.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    seller.sellerRating = totalRating / seller.reviews.length;

    await seller.save();

    sendNotificationToUser({
      type: "user",
      recipient: seller._id,
      sender: req.user._id,
      body: `${
        req.user.username
      } reviewed you with a rating of ${rating}. Comment: ${
        comment.length > 15 ? comment.slice(0, 15) + "..." : comment
      }`,
    });
    res.status(201).json(seller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const getTopRatedUsers = CatchAsyncError(async (req, res) => {
  try {
    const topRatedUsers = await User.aggregate([
      {
        $match: { sellerRating: { $gte: 3 } },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "user",
          as: "sellerProducts",
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          photo: 1,
          sellerRating: 1,
          productsCount: { $size: "$sellerProducts" },
          reviewsCount: { $size: "$reviews" },
        },
      },
      {
        $sort: { sellerRating: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json(topRatedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  register,
  login,
  myProfile,
  updateProfile,
  createSellerRating,
  getTopRatedUsers,
  getUserById,
};
