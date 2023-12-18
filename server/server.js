const dotenv = require("dotenv");
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const connectToDB = require("./middlewares/dbConnect.js");
const indexRouter = require("./routes/index.routes.js");
const testRouter = require("./routes/test.routes.js");
dotenv.config({ path: "./config/config.env" }); // Adjust the path as needed

// Create an Express app
const app = express();
const port = process.env.PORT || 8080;
const { createAdminUserIfNotExist } = require("./utils/adminUtils.js");
const WS = require("./wsServer.js");
const { Server } = require("socket.io");

const httpServer = http.createServer(app);

// Connect to MongoDB
connectToDB();

// Middlewares
app.use(express.json());
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Enhance security by setting various HTTP headers
// Add a custom Cross-Origin-Resource-Policy header
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
app.use(morgan("dev")); // Log HTTP requests
app.use(bodyParser.json()); // Parse request bodies for JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parse request bodies for x-www-form-urlencoded
app.use(express.static("uploads")); // Make uploads folder static

// Routes
app.use("/api", indexRouter);
app.use("/", testRouter);
app.use((err, rea, res, next) => {
  const errorStatus = err.code || 500;
  const errorMessage = err.message || "something went wrong!";
  return res.status(errorStatus).json(errorMessage);
});

WS.attach(httpServer)

// Create admin user if not exist
createAdminUserIfNotExist();

httpServer.listen(port, () => {
  console.log(`Server listening successfully on http://localhost:${port}`);
});
