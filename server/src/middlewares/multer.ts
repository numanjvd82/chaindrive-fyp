import multer from "multer";

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Create an upload instance
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG is allowed"));
    }
  },
});

export default upload;
