import { StatusCodes } from "http-status-codes";
import User from "../models/UserSchema.js";
import OTPschema from "../models/OtpSchema.js";
import { createTransport } from "nodemailer";
import OtpSchema from "../models/OtpSchema.js";
import bcrypt from "bcrypt";

let transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) {
    console.log(err, "is error");
  } else {
    // console.log("is successful");
  }
});

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

async function sendVerificationEmail(email, otp) {
  const mailOption = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Resetting your MyEarthAsset account password ",
    html: `<h1 style="text-align:center;color:salmon">Hello MyEarthAsset member's</h1>
        <h4  style="text-align:center;color:black;margin-bottom:20">You have requested to reset the password of your myearthasset account</h4>
        <h4  style="text-align:center;color:black;margin-bottom:5">Please find the security code to change your password</h4>
        <h2 style="text-align:center;color:salmon;">${otp}</h2> 
        <h4  style="text-align:center;color:black;margin-top:20">Sportingly,</h4>
        <p style="text-align:center;color:salmon;margin:0;font-weight:700;font-size:18px">MyEarthAsset Team</p> 
        `,
  };
  transporter.sendMail(mailOption, (err, info) => {});
}

export const emailVerify = async (req, res) => {
  const email = req.query.email;
  console.log("workinf", email);
  const isUserAvailable = await User.findOne({ email });
  try {
    if (!isUserAvailable) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email is not registered, Please enterd valid email",
        statuscode: 400,
      });
      return;
    } else {
      let otp = generateOtp();
      let otpDocument = await OtpSchema.findOne({ email });

      if (otpDocument) {
        // Update the existing OTP document
        otpDocument.otp = otp;
        await otpDocument.save();
      } else {
        // Create a new OTP document
        otpDocument = new OtpSchema({ email, otp });
        await otpDocument.save();
      }

      await sendVerificationEmail(email, otp);
      res.status(StatusCodes.OK).json({
        message: "Otp sent to your mail",
        statuscode: 200,
      });
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Email is not registered, Please enterd valid email",
      statuscode: 400,
    });
  }
};
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const isUserAvailable = await User.findOne({ email });
  try {
    if (isUserAvailable) {
      const otpPerEmail = await OtpSchema.findOne({ email });
      if (otpPerEmail) {
        if (otpPerEmail.otp === otp) {
          res.status(StatusCodes.OK).json({
            message: "OTP verified successfully",
            statuscode: 200,
          });
          try {
            await OtpSchema.findOneAndDelete({ email });
            console.log("deleted successfully");
          } catch (error) {
            console.log("deleted failed");
          }
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "Incorrect OTP Entered",
            statuscode: 400,
          });
        }
      } else {
        res.status(StatusCodes.OK).json({
          message: "OTP has expired",
          statuscode: 400,
        });
      }
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Email is not registered, Please enterd valid email",
      statuscode: 400,
    });
  }
};
export const resetPassword = async (req, res) => {
  const { email, confirmPassword, newpassword } = req.body;
  if (!confirmPassword || !newpassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Required Information",
      statuscode: 400,
    });
  }

  try {
    const hash_password = bcrypt.hashSync(newpassword, 8);

    let user = await User.findOne({ email });

    if (user) {
      user.hash_password = hash_password;
      await user.save();
      res.status(StatusCodes.OK).json({
        message: "Password Reset Successfully",
        statuscode: 200,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email is not registered, Please enterd valid email",
        statuscode: 400,
      });
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Email is not registered, Please enterd valid email",
      statuscode: 400,
    });
  }
};
