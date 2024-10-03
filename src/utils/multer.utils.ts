import multer from "multer";
import fs from "fs";
import path from "path";

export const uploadDir = path.join("src", "uploaded-files");
export const tempDir = path.join("src", "temp-files");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // Temporary directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Ensure unique names to avoid overwriting files
  },
});

export const upload = multer({
  storage,
});
