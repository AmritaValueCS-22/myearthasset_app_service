import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
const { sign } = jwt;

export const signUp = async (req, res) => {
  const { fullname, email, password, role, selectId, idNumber, mobile } =
    req.body;

  if (!fullname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Required Information",
      statuscode: 400,
    });
  }
  console.log(req.file.path);
  const hash_password = bcrypt.hashSync(password, 8);
  const userData = {
    id: randomUUID(),
    fullname,
    email,
    hash_password,
    selectId,
    idNumber,
    profilePicture: req.file.path,
    role,
    Active: false,
    contactNumber: mobile,
    noOfAssets: 0,
  };
  let user = await User.findOne({ email });

  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User already registered, Try to login !",
      statuscode: 400,
    });
  } else {
    User.create(userData).then((data, err) => {
      if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
      else {
        res
          .status(StatusCodes.CREATED)
          .json({ message: "User created Successfully", statuscode: 201 });
      }
    });
  }
};
export const signIn = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please enter email and password",
        statuscode: 400,
      });
      return;
    }

    const user = await User.findOne({ email: req.body.email });
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.hash_password
    );
    console.log(req.body.password, user.hash_password, passwordIsValid);
    if (!passwordIsValid) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        accessToken: null,
        message: "Invalid Password!",
        statuscode: 401,
      });
    }
    console.log("hello");
    if (user) {
      if (user.authenticate(req.body.password)) {
        console.log("yoooooooooooooo");
        const token = sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        const { _id, email, role, fullname, profilePicture, id } = user;
        user.Active = true;
        await user.save();
        res.status(StatusCodes.OK).json({
          user: { id, token },
          message: "Logged In Successfully",
          statuscode: 200,
        });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Something went wrong!",
          statuscode: 401,
        });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "User does not exist..!",
        statuscode: 400,
      });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "naaaa" });
  }
};
export const logout = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    // Find the user in the database
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set login status to false
    user.Active = false;
    await user.save();

    return res.status(StatusCodes.OK).json({
      message: "Logout Successfully",
      statuscode: 200,
    });
  } catch (error) {
    console.error("Error during logout", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
