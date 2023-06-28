// import multer from "multer";
// import path from "path";
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `${file.fieldname}-myEarth-${Date.now()}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });
// const upload = multer({ storage });
// export const uploadMiddlewear = upload.single("image");
import multer, { diskStorage } from "multer";
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  //   limits: { fileSize: 10 },
});

export default upload;
