import dotenv from "dotenv";
import { IMAGE } from "../models/userPostSchema.js";
import { StatusCodes } from "http-status-codes";
import UserSchema from "../models/UserSchema.js";
import { ADMIN_ID } from "../../utilis/index.js";

dotenv.config();

export const uploadImage = async (req, res) => {
  const { description, tags, longtitude, latitude, id, email } = req.body;
  if (!req.file) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No files to upload", statuscode: 400 });
    return;
  }
  console.log(req.body);
  try {
    const image = new IMAGE({
      description: description,
      // tags: req.body.tags.split(",").map((tag) => tag.trim()),
      tags: tags,
      longtitude: longtitude,
      latitude,
      // imageUrl: path.basename(req.file.path),
      imageUrl: req.file.path,
      id,
      email,
    });
    const user = await UserSchema.findOne({ email });
    let totalAssets = user.noOfAssets;
    user.noOfAssets = totalAssets + 1;
    await user.save();

    // Save the image to the database
    await image.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Image uploaded successfully", statuscode: 201 });
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Image uploaded Failed", statuscode: 400 });
  }
};
export const getUsers = async (req, res) => {
  const id = req.query.id;

  // Check if email and token are provided
  if (!id) {
    return res.status(400).json({ error: "Email and token are required." });
  }

  try {
    // Find the user based on email and token
    const user = await UserSchema.findOne({ id });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found or invalid credentials." });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
export const getAllUsersAssets = async (req, res) => {
  const id = req.query.id;

  // Check if email and token are provided
  if (!id) {
    return res.status(400).json({ error: "Email and token are required." });
  }
  if (id === ADMIN_ID) {
    try {
      // Find the user based on email and token
      const user = await IMAGE.find();

      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found or invalid credentials." });
      }

      return res.json({ user });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res.status(404).json({ error: "You Don't Have an access" });
  }
};
export const getAllUsers = async (req, res) => {
  const id = req.query.id;

  // Check if email and token are provided
  if (!id) {
    return res.status(400).json({ error: "Email and token are required." });
  }
  if (id === ADMIN_ID) {
    try {
      // Find the user based on email and token
      const user = await UserSchema.find();

      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found or invalid credentials." });
      }

      return res.json({ user });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res.status(404).json({ error: "You Don't Have an access" });
  }
};
export const getImageById = async (req, res) => {
  const id = req.query.id;
  // Check if email and token are provided

  try {
    // Find the user based on email and token
    const user = await IMAGE.find({ id });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found or invalid credentials." });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
