import multer from "multer";

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Create an upload instance
const upload = multer({ storage });

export default upload;
