import express from "express";
import { getUsers, uploadImage } from "../controller/post.js";
import { uploadMiddlewear } from "../middlewear/uploadImage.js";
const router = express.Router();

router.post("/post", uploadMiddlewear, uploadImage);
router.get("/getDetails", getUsers);
export default router;
