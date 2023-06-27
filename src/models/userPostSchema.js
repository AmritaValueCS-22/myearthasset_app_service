import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    description: String,
    tags: [String],
    latitude: Number,
    longtitude: Number,
    imageUrl: String,
    id: String,
  },
  { timestamps: true }
);
export const IMAGE = mongoose.model("earthAssets", postSchema);
