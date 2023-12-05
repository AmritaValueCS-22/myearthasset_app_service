// src/controllers/profileController.js
import { StatusCodes } from "http-status-codes";
import User from "../model/userSchema.js";

export const addProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const userProfileData = req.body;
    console.log("userProfileData", userProfileData);
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

export const editProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const userProfileData = req.body;

    const user = await User.findOne({ userId });
    const findProfile = user.profile.find((profile) => {
      return profile.id === userProfileData.id;
    });
    console.log(findProfile, userProfileData, "hello");
    await user.save();
    if (!findProfile || !user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }
    Object.assign(findProfile, userProfileData);
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Profile added successfully",
      statuscode: 200,
      id: userProfileData.id,
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
    const { userId } = req.params;
    const { id } = req.query;
    console.log(userId, id);
    const user = await User.findOne({ userId });
    const findProfileIndex = user.profile.findIndex((profile) => {
      return profile.id === id;
    });
    console.log(findProfileIndex);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }
    if (findProfileIndex === -1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Profile not found",
        statuscode: 400,
      });
    }

    user.profile.splice(findProfileIndex, 1);
    await user.save();
    //
    res.status(StatusCodes.OK).json({
      message: "Profile deleted successfully",
      statuscode: 200,
    });
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Internal Server Error",
      statuscode: 400,
    });
  }
};
