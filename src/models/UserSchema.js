import { Schema, model } from "mongoose";
import { compare } from "bcrypt";
const userSchema = new Schema(
  {
    id: { type: String },
    fullname: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["normaluser", "organizationUser", "registerUser"],
      require: true,
    },
    contactNumber: {
      type: String,
    },
    profilePicture: { type: String },
    selectId: {
      type: String,
    },
    idNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.method({
  async authenticate(password) {
    return compare(password, this.hash_password);
  },
});
export default model("User", userSchema);
