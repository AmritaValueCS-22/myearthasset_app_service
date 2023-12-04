// src/routes/profileRoutes.js
import express from "express";
import { addProfile } from "../controller/profileController.js";
import { authenticateUser } from "../middlewear/authMiddleWear.js";
const router = express.Router();

router.post("/add-profile", authenticateUser, addProfile);

export default router;
