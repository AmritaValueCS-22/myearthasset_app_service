import { Router } from "express";
const router = Router();
import { signUp, signIn, logout } from "../controller/auth.js";
import {
  isRequestValidated,
  validateSignUpRequest,
  validateSignIpRequest,
} from "../validater/fileAuth.js";
import { uploadImage } from "../controller/post.js";
import { uploadMiddlewear } from "../middlewear/uploadImage.js";
import { AdminSignIn, AdminSignUp } from "../controller/adminAuth.js";
import {
  emailVerify,
  resetPassword,
  verifyOtp,
} from "../controller/Forgetpassword.js";

router.route("/signin").post(validateSignIpRequest, isRequestValidated, signIn);
router.route("/verifyEmail").get(emailVerify);
router.route("/verifyOtp").post(verifyOtp);
router.route("/resetPassword").post(resetPassword);

router
  .route("/signup")
  .post(uploadMiddlewear, validateSignUpRequest, isRequestValidated, signUp);
router.route("/logout").post(logout);
router.route("/post").post(uploadImage);

export default router;
