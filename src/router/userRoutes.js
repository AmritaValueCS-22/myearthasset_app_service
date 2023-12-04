// src/routes/profileRoutes.js
import express from "express";
import { userDetails, getAllUserNames } from "../controller/userDetails.js";

const router = express.Router();

router.get("/userDetails", userDetails);
router.get("/userName", getAllUserNames);

export default router;
