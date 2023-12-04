import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./src/router/authRoute.js";
import profileRoutes from "./src/router/profileRouter.js";
import eventRoutes from "./src/router/eventRoutes.js";
import userRoutes from "./src/router/userRoutes.js";
import attedenceRouter from "./src/router/attedenceRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/events", eventRoutes);
app.use("/user", userRoutes);
app.use("/user/attedence", attedenceRouter);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
