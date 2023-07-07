import { generate } from "otp-generator";
const generateOTP = () => {
  const otp = generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  return otp;
};
export { generateOTP };
