import { Router } from "express";
const router = Router();
import { signUp, signIn } from "../controller/auth.js";
import {
  isRequestValidated,
  validateSignUpRequest,
  validateSignIpRequest,
} from "../validater/fileAuth.js";
import { uploadImage } from "../controller/post.js";
import { uploadMiddlewear } from "../middlewear/uploadImage.js";
import { loginApi } from "../controller/googleAuth.js";

router.route("/signin").post(validateSignIpRequest, isRequestValidated, signIn);

router
  .route("/signup")
  .post(uploadMiddlewear, validateSignUpRequest, isRequestValidated, signUp);
router.post("/google-signin", loginApi);
router.route("/post").post(uploadImage);

export default router;
