const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    validate: {
      validator: function (value) {
        return emailRegex.test(value);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    require: [true, ["Please enter your password"]],
    minLength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["superadmin", "seller", "buyer"],
    default: "user",
  },
  photo: {
    type: String,
  },
  reviews: [reviewSchema],
  sellerRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});
// Hash the password before saving and updating
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      {
        _id: this._id,
        role: this.role,
        username: this.username,
      },
      JWT_SECRET
    );
    return token;
  } catch (err) {
    throw new Error(err);
  }
};

userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    throw new Error(err);
  }
};

const User = model("User", userSchema);

module.exports = User;
