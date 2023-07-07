import { Schema, model } from "mongoose";
import { compare } from "bcrypt";
const userSchema = new Schema({
  id: { type: String },
  uniqueNumber: String,
  createdAt: Date,
  expiredAt: Date,
});

userSchema.method({
  async authenticate(password) {
    return compare(password, this.hash_password);
  },
});
export default model("VerifyAdminUser", userSchema);
