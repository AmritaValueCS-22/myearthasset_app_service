// src/routes/eventRoutes.js
import express from "express";
import { addEvent } from "../controller/eventController.js";
import { authenticateUser } from "../middlewear/authMiddleWear.js";

const router = express.Router();

router.post("/add-event", authenticateUser, addEvent);

export default router;
