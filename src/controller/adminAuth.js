import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { createTransport } from "nodemailer";
import adminUserSchema from "../models/adminUserSchema.js";
import { ADMIN_ID } from "../../utilis/index.js";
import { v4 as uuidv4 } from "uuid";
import verifyAdminUser from "../models/verifyAdminUser.js";
import path from "path";
const __dirname = path.resolve();
console.log(path.join(__dirname + "/src/View/verify.html"));
const { sign } = jwt;
let transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
transporter.verify((err, success) => {
  if (err) {
    console.log(err, "is error");
  } else {
    console.log("is successful");
  }
});
export const AdminSignUp = async (req, res) => {
  const { fullname, email, password, role } = req.body;
  console.log(req.body);
  if ((!fullname, !email, !password)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Enter all feilds", statuscode: 400 });
  }
  try {
    adminUserSchema.find({ email }).then((result) => {
      if (result.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "User Admin already registered, Try to login !",
          statuscode: 400,
        });
      } else {
        // if (!result[0].verified) {
        //   return res.status(StatusCodes.BAD_REQUEST).json({
        //     message: "Email has not been verified please check inbox",
        //     statuscode: 400,
        //   });
        // } else {
        const roundCount = 10;
        bcrypt
          .hash(password, roundCount)
          .then((hash_password) => {
            const admin = new adminUserSchema({
              fullname,
              id: ADMIN_ID,
              email,
              hash_password,
              role,
              verified: false,
            });
            admin
              .save()
              .then((result) => {
                // res.status(StatusCodes.CREATED).json({
                //   message: "User Admin created Successfully",
                //   statuscode: 201,
                //   data: result,
                // });
                sendVerificationEmail(result, res);
              })
              .catch((err) => {
                return res.status(StatusCodes.BAD_REQUEST).json({
                  err: "An error accure while saving user admin account!",
                });
              });
          })
          .catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({
              err: "An error accure while hashing password!",
            });
          });
      }
      // }
    });
  } catch (error) {
    console.log(error);
  }
};
const sendVerificationEmail = async ({ _id, email }, res) => {
  const currentUrl = "http://123.63.2.13:8080";
  const uniqueString = uuidv4() + _id;
  const mailOption = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Verify your Email",
    html: `<p>Verify your email address to complete the signup </p><p> This Link <b>expires in 6 hours </b>.</p><p> Press <a href=${
      currentUrl + "/verify/" + _id + "/" + uniqueString
    }>here</a>to proceed.</p>`,
  };
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new verifyAdminUser({
        id: _id,
        uniqueNumber: hashedUniqueString,
        expiredAt: Date.now() + 600000,
        createdAt: Date.now(),
      });
      newVerification
        .save()
        .then(() => {
          transporter.sendMail(mailOption).then(() => {
            return res.status(StatusCodes.ACCEPTED).json({
              message: "Verification Mail Sent",
              statuscode: 200,
            });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(StatusCodes.BAD_GATEWAY).json({
            message: "Verification Mail failed  ",
            statuscode: 400,
          });
        });
    })
    .catch(() => {
      return res.status(StatusCodes.BAD_REQUEST).json({
        err: "An error accure while hashing email!",
      });
    });
};
export const VerifyUser = async (req, res) => {
  const { id, uniqueString } = req.params;
  console.log(id, uniqueString);
  verifyAdminUser
    .find({ id })
    .then((result) => {
      if (result.length > 0) {
        const { expiredAt } = result[0];
        const hashedUniqueString = result[0].uniqueNumber;
        if (expiredAt < Date.now()) {
          verifyAdminUser
            .deleteOne({ id })
            .then((result) => {
              adminUserSchema
                .deleteOne({ _id: id })
                .then((result) => {
                  let message = `Link has expired. Please sign up again`;
                  res.redirect(`/verified?error=true&message=${message}`);
                })
                .catch((error) => {
                  console.log(error);
                  let message = `Clearing user with expired unique string failed`;
                  res.redirect(`/verified?error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error, "ueueueu");
              let message = `An error occurred while clearing expired user verification record`;
              res.redirect(`/verified?error=true&message=${message}`);
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                adminUserSchema
                  .updateOne({ _id: id }, { verified: true })
                  .then((result) => {
                    verifyAdminUser
                      .deleteOne({ id })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname + "/src/View/verify.html")
                        );
                      })
                      .catch((err) => {
                        console.log(err, "fjfjfj");
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message = `An Error occure while updating user record to show verified`;
                    res.redirect(`/verified?error=true&message=${message}`);
                  });
              } else {
                let message = `invalid verification details passed.Check your inbox`;
                res.redirect(`/verified?error=true&message=${message}`);
              }
            })
            .catch((error) => {
              let message = `An Error occure while comparing unique string`;
              res.redirect(`/verified?error=true&message=${message}`);
            });
        }
      } else {
        let message = `Account Record doesn't exist or has been verified already.Please Signup or log in`;
        res.redirect(`/verified?error=true&message=${message}`);
      }
    })
    .catch((err) => {
      console.log(err, "helll");
      let message = `An error occurred while checking  for existing user verification record`;
      res.redirect(`/verified?error=true&message=${message}`);
    });
};
export const VerifiedUser = async (req, res) => {
  console.log("successfull");
  res.sendFile(path.join(__dirname + "/src/View/verify.html"));
};

export const AdminSignIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if ((!email, !password)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Enter all feilds", statuscode: 400 });
  }
  try {
    const admin = await adminUserSchema.findOne({ email: req.body.email });

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      admin.hash_password
    );
    if (!passwordIsValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        accessToken: null,
        error: "Invalid Password!",
        statuscode: 401,
      });
    }
    if (admin) {
      if (passwordIsValid) {
        const token = sign(
          { _id: admin._id, role: admin.role },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        const { id, _id } = admin;
        res.status(StatusCodes.OK).json({
          user: { id, token, userId: _id },
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
      console.log("err");
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "User does not exist..!",
        statuscode: 400,
      });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "User does not exist..!",
      statuscode: 400,
    });
  }
};
export const getAdminUsers = async (req, res) => {
  const id = req.query.id;
  console.log(id);
  // Check if email and token are provided
  if (!id) {
    return res.status(400).json({ error: "Email and token are required." });
  }

  try {
    // Find the user based on email and token
    const user = await adminUserSchema.findOne({ _id: id });

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
