import express from "express";
import {
  getImageById,
  getUsers,
  pos,
  uploadImage,
} from "../controller/post.js";
import upload from "../middlewear/uploadImage.js";
// import { uploadMiddlewear } from "../middlewear/uploadImage.js";
const router = express.Router();

// router.post("/post", uploadMiddlewear, uploadImage);
router.post("/upload_file", upload.single("image"), pos);
router.get("/getDetails", getUsers);
router.get("/getImages", getImageById);
export default router;
