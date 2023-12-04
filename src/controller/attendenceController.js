import { StatusCodes } from "http-status-codes";
import User from "../model/userSchema.js";

export const attendenceUpdate = async (req, res) => {
  try {
    const { userId } = req.user;
    const { eventName, id, attedence, reason, startDate, endDate } = req.body;

    let user = await User.findOne({ userId });
    console.log(user, req.body);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }

    user.profile.map((item) => {
      let userAttedence = item.attedence;
      if (item.id === id) {
        const obj = {
          eventName,
          attedence,
          reason,
          startDate,
          endDate,
          name: item.name,
          class: item.class,
        };
        item.attedence = item.attedence || [];
        item.attedence = [...userAttedence, obj];
      }
    });

    if (user.userRole === "participant") {
      await user.save();
      res.status(StatusCodes.OK).json({
        message: "Successfully Entered",
        statuscode: 200,
        userProfile: user.profile,
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

export const getAttedence = async (req, res) => {
  try {
    const { userId } = req.query;

    let user = await User.findOne({ userId });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
        statuscode: 400,
      });
    }
    let attedenceUser = [];
    const allUsers = await User.find({});
    allUsers.map((item) => {
      if (item.username !== "admin") {
        item.profile.map((attedences) => {
          console.log(attedences.attedence);
          attedenceUser = [...attedences.attedence, ...attedenceUser];
        });
      }
    });
    console.log(attedenceUser);
    if (user.userRole === "organizer") {
      res.status(StatusCodes.OK).json({
        message: "username fetched",
        statuscode: 200,
        attedence: attedenceUser,
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
