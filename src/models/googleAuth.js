import { Schema, model } from "mongoose";

const authSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  profilePi: String,
  googleId: {
    type: String,
    default: null,
  },
});

export const Auth = model("GoogleUsers", authSchema);
