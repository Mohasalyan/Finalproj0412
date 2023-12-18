const multer = require("multer");
const path = require("path");
const { dirname } = require("path");
const { fileURLToPath } = require("url");
const fs = require("fs");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const uploadFolder = path.join(__dirname, "..", "uploads");
// Create the 'uploads' directory if it doesn't exist
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}
// Create a Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const ext = Date.now() + path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const regex = new RegExp(`^(image|application)\/(jpg|png|jpeg|webp)$`, "ig");
  // if (!regex.test(file.mimetype)) {
  //   return cb(
  //     new Error(
  //       "Invalid file type. Only image files (jpg, png, jpeg, webp) are allowed"
  //     ),
  //     false
  //   );
  // }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 },
});

const uploadFiles = (req, res, next) => {
  const uploadFile = upload.fields([{ name: "image", maxCount: 1 }]);
  uploadFile(req, res, (err) => {
    if (err) {
      // Improved error handling: Check if it's a Multer error
      if (err instanceof multer.MulterError) {
        // Multer error (e.g., file size exceeded)
        return res.status(400).json({ success: false, message: err.message });
      } else {
        // Other errors (e.g., file type validation)
        return res.status(400).json({ success: false, message: err.message });
      }
    }
    next();
  });
};

module.exports = uploadFiles;
