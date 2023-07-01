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

router.route("/signin").post(validateSignIpRequest, isRequestValidated, signIn);

router
  .route("/signup")
  .post(uploadMiddlewear, validateSignUpRequest, isRequestValidated, signUp);
router.route("/logout").post(logout);
router.route("/admin/signup").post(uploadMiddlewear, AdminSignUp);
router.route("/adminSignin").post(AdminSignIn);
router.route("/post").post(uploadImage);

export default router;
