// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const attedenceSchema = new mongoose.Schema({
  eventName: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  attedence: { type: Boolean },
  reason: { type: String },
  id: { type: String, require: true },
});
const profileSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  grade: { type: String },
  age: { type: Number },
  class: { type: String },
  buildingName: { type: String },
  roomNumber: { type: String },
  dateOfBirth: { type: String },
  emergencyContact: { type: {} },
  attedence: [attedenceSchema],
});
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "username" }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  allDay: { type: Boolean, default: false },
  location: { type: String },
  repeat: { type: String },
});
const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: false },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
    lowercase: true,
  },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false },
  phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  userRole: {
    type: String,
    required: true,
    enum: ["organizer", "participant"],
  },
  profile: [profileSchema],
  events: [eventSchema],
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.userId) {
      const generatedUserId = await generateUserId();
      this.userId = generatedUserId;
    }

    if (this.isModified("password")) {
      console.log(this.password);
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }

    if (this.isModified("confirmPassword")) {
      this.confirmPassword = undefined;
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

const generateUserId = async () => {
  const randomId = Math.floor(10000 + Math.random() * 90000).toString();
  const userWithSameId = await User.findOne({ userId: randomId });
  return userWithSameId ? generateUserId() : randomId;
};
