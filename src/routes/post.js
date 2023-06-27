import express from "express";
import { getImageById, getUsers, uploadImage } from "../controller/post.js";
import { uploadMiddlewear } from "../middlewear/uploadImage.js";
const router = express.Router();

router.post("/post", uploadImage);
router.get("/getDetails", getUsers);
router.get("/getImages", getImageById);
export default router;
