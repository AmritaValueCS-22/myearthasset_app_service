import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-myEarth-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});
const upload = multer({ storage });
export const uploadMiddlewear = upload.single("image");
