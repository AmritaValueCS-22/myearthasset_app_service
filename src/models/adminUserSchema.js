import { Schema, model } from "mongoose";
import { compare } from "bcrypt";
const userSchema = new Schema(
  {
    id: { type: String },
    fullname: {
      type: String,
      require: true,
      trim: true,
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
      require: true,
    },
    verified: Boolean,
  },
  { timestamps: true }
);

userSchema.method({
  async authenticate(password) {
    return compare(password, this.hash_password);
  },
});
export default model("AdminUser", userSchema);
