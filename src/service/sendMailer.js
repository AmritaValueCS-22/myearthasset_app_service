import expressAsyncHandler from "express-async-handler";
import { config } from "dotenv";
import { createTransport } from "nodemailer";
import { generateOTP } from "./generateOtp.js";
config();

let transporter = createTransport({
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// const sendEmail = expressAsyncHandler(async (req, res) => {
//   const { email } = req.body;
//   console.log(email);

//   const otp = generateOTP();

//   var mailOptions = {
//     from: process.env.SMTP_MAIL,
//     to: email,
//     subject: "OTP form MyEarthAssets",
//     text: `Your OTP is: ${otp}`,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent successfully!");
//     }
//   });
// });

export default { sendEmail };
