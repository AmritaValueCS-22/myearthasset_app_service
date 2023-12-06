import { StatusCodes } from "http-status-codes";
import User from "../model/userSchema.js";

export const userDetails = async (req, res) => {
  try {
    const { userId } = req.query;

    let user = await User.findOne({ userId });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }
    if (user.userRole === "participant") {
      res.status(StatusCodes.OK).json({
        message: "fetched userData",
        statuscode: 200,
        user,
      });
    } else {
      res.status(StatusCodes.OK).json({
        message: "fetched userData",
        statuscode: 200,
        user: await User.find({}),
        userEvents: user.events,
      });
    }
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Internal Server Error",
      statuscode: 400,
    });
  }
};
export const getAllUserNames = async (req, res) => {
  try {
    const { userId } = req.query;

    let user = await User.findOne({ userId });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }
    let userNames = [];
    const allUsers = await User.find({});
    allUsers.map((item) => {
      if (item.username !== "Organizer") {
        userNames.push(item.username);
      }
    });

    if (user.userRole === "organizer") {
      res.status(StatusCodes.OK).json({
        message: "username fetched",
        statuscode: 200,
        userNames: userNames,
      });
    }
  } catch (error) {
    console.error(error);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Internal Server Error",
      statuscode: 400,
    });
  }
};
