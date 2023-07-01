import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
const { sign } = jwt;

export const AdminSignUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const admin = new User({
      username,
      password,
      isAdmin: true,
    });

    await admin.save();

    return res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error during admin signup", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const AdminSignIn = async (req, res) => {
  console.log(req);
};
