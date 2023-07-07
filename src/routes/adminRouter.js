import { Router } from "express";
import {
  AdminSignIn,
  AdminSignUp,
  VerifiedUser,
  VerifyUser,
  getAdminUsers,
} from "../controller/adminAuth.js";
const router = Router();

router.route("/adminSignUp").post(AdminSignUp);
router.route("/adminSignIn").post(AdminSignIn);
router.route("/verify/:id/:uniqueString").get(VerifyUser);
router.route("/verified").get(VerifiedUser);
router.route("/getAdminDetails").get(getAdminUsers);

export default router;
