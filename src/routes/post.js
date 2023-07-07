import express from "express";
import {
  getAllUsers,
  getAllUsersAssets,
  getImageById,
  getUsers,
  uploadImage,
} from "../controller/post.js";
import { uploadMiddlewear } from "../middlewear/uploadImage.js";

const router = express.Router();

router.post("/post", uploadMiddlewear, uploadImage);
router.get("/getDetails", getUsers);
router.get("/getAllUser", getAllUsers);
router.get("/getImages", getImageById);
router.get("/getAllUserImage", getAllUsersAssets);

export default router;
