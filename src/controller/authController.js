// src/controllers/authController.js
import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
dotenv.config();

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    userRole: user.userRole,
  };
  const secretKey = process.env.SECRET_KEY;
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secretKey, options);
};
export const signup = async (req, res) => {
  const { username, email, password, confirmPassword, phoneNumber, userRole } =
    req.body;

  if (!username || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Required Information",
      statuscode: 400,
    });
  }
  if (!["organizer", "participant"].includes(userRole)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid user role. Use either "organizer" or "participant".',
      statuscode: 400,
    });
  }
  if (password !== confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Passwords do not match.", statuscode: 400 });
  }

  let user = await User.findOne({ email });
  const userData = {
    username,
    email,
    password,
    confirmPassword,
    phoneNumber,
    userRole,
  };

  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User already registered, Try to login !",
      statuscode: 400,
    });
  } else {
    User.create(userData).then((data, err) => {
      if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
      else
        res.status(StatusCodes.CREATED).json({
          message: `${userRole} created Successfully`,
          statuscode: 201,
        });
    });
  }
};

// export const signup = async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       password,
//       confirmPassword,
//       phoneNumber,
//       userRole,
//     } = req.body;

//     const checkuserisAlredyThere = await User.find();
//     console.log(checkuserisAlredyThere);
//     if (checkuserisAlredyThere) {
//       console.log("hello");
//       return res.status(400).json({ error: "User Alredy Register" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: "Passwords do not match." });
//     }

//     const userData = new User({
//       username,
//       email,
//       password,
//       confirmPassword,
//       phoneNumber,
//       userRole,
//     });
//     await user.save();

//     res.status(201).json({
//       statusCode: 201,
//       message: `${userRole} registered successfully.`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(password);
    const user = await User.findOne({ email });

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(
    //   hashPassword,
    //   user.password,
    //   await bcrypt.compare(hashPassword, user.password)
    // );
    if (user) {
      const token = generateToken(user);
      console.log(token);
      return res.status(StatusCodes.OK).json({
        message: "Login successful",
        userRole: user.userRole,
        userId: user.userId,
        token,
        isUserHaveProfile: user.profile.length > 0,
        statuscode: 200,
      });
    }
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid credentials",
      statuscode: 400,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Internal Server Error", statuscode: 400 });
  }
};
