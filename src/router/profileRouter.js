// src/routes/profileRoutes.js
import express from "express";
import {
  addProfile,
  deleteProfile,
  editProfile,
} from "../controller/profileController.js";
import { authenticateUser } from "../middlewear/authMiddleWear.js";
const router = express.Router();

router.post("/add-profile", authenticateUser, addProfile);
router.put("/editProfile/:userId", editProfile);
router.delete("/deleteProfile/:userId", deleteProfile);

export default router;
