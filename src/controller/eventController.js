// Assuming you have ObjectId from mongoose
import mongoose from "mongoose";
import moment from "moment";
import User from "../model/userSchema.js";
import { StatusCodes } from "http-status-codes";

export const addEvent = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      eventName,
      participants, // Array of participant usernames
      startDate,
      endDate,
      allDay,
      location,
      startTime,
      endTime,
      repeat,
    } = req.body;

    // Find the organizer by userId
    const organizer = await User.findOne({ userId });

    if (!organizer || organizer.userRole !== "organizer") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Permission denied. Only organizers can add events.",
        statuscode: 400,
      });
    }

    // Convert participant usernames to ObjectId
    const participantIds = await Promise.all(
      participants.map(async (participantUsername) => {
        const participant = await User.findOne({
          username: participantUsername,
        });
        return participant ? participant._id : null;
      })
    );

    // Create a new event
    const newEvent = {
      eventName,
      participants: participantIds,
      startDate,
      endDate,
      startTime,
      endTime,
      allDay,
      location,
      repeat,
    };
    console.log(newEvent);
    let events = [];

    // Add the event to the organizer's events array
    organizer.events.push(newEvent);

    // Save the organizer document with the updated events array
    await organizer.save();

    // Share the event details with selected participants
    await Promise.all(
      participantIds.map(async (participantId) => {
        const participant = await User.findById(participantId);
        if (participant) {
          console.log(participant, "hello");
          // Update the event details for the participant
          participant.events.push(newEvent);
          await participant.save();
        }
      })
    );
    res.status(StatusCodes.CREATED).json({
      message: "Event added successfully",
      event: newEvent,
      statuscode: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Event added successfully",
      event: newEvent,
      statuscode: 400,
    });
  }
};
