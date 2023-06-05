import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import path from "path";
const { sign } = jwt;

export const signUp = async (req, res) => {
  const { fullname, email, password, role, selectId, idNumber } = req.body;

  if (!fullname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Required Information",
      statuscode: 400,
    });
  }
  const hash_password = await hash(password, 10);
  const userData = {
    id: randomUUID(),
    fullname,
    email,
    hash_password,
    selectId,
    idNumber,
    profilePicture: path.basename(req.file.path),
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
      else
        res
          .status(StatusCodes.CREATED)
          .json({ message: "User created Successfully", statuscode: 201 });
    });
  }
};
export const signIn = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.email || !req.body.password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please enter email and password",
        statuscode: 400,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.authenticate(req.body.password)) {
        console.log("yoooooooooooooo");
        const token = sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        const { _id, email, role, fullname, profilePicture, id } = user;
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
