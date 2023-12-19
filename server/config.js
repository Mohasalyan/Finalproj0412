const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { DB_URL, PORT, JWT_SECRET };
