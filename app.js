import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/db/conect.js";
const app = express();
import cors from "cors";
import authRouter from "./src/routes/auth.js";
import postReducer from "./src/routes/post.js";
import { MongoDbURL } from "./utilis/index.js";
import bodyParser from "body-parser";
import multer from "multer";
app.use(cors());
app.use(json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("uploads"));
app.use("/api", authRouter);
app.use("/user", postReducer);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName);
  },
});

const upload = multer({
  storage: storage,
});

app.post("/api/registers", upload.single("profilePicture"), (req, res) => {
  const { firstName, password, email } = req.body;
  res.send("hi");
});

//Port and Connect to DB
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(MongoDbURL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("error =>", error);
  }
};
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack, "err");

  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

start();
