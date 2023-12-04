// src/controllers/profileController.js
import { StatusCodes } from "http-status-codes";
import User from "../model/userSchema.js";

export const addProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const userProfileData = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }

    user.profile.push(userProfileData);

    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Profile added successfully",
      statuscode: 200,
      userId,
    });
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Internal Server Error",
      statuscode: 400,
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { userId, id } = req.params;

    const userProfileData = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }

    user.profile.push(userProfileData);

    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Profile added successfully",
      statuscode: 200,
      userId,
    });
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Internal Server Error",
      statuscode: 400,
    });
  }
};
