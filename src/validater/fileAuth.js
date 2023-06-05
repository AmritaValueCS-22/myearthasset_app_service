import { check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateSignUpRequest = [
  check("fullname").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid Email required"),
  check("mobile").isMobilePhone().withMessage("Valid Mobile required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")

    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not same");
      }
      return true;
    }),
];
export const validateSignIpRequest = [
  check("email").isEmail().withMessage("Valid Email required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];
export const isRequestValidated = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (errors.array().length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: errors.array()[0].msg });
  }
  next();
};
