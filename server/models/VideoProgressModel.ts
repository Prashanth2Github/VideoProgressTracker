import mongoose from "mongoose";

const VideoProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  intervals: { type: [[Number]], required: true }, // array of [number, number]
  totalUniqueSeconds: { type: Number, required: true, default: 0 },
  lastPosition: { type: Number, required: true, default: 0 },
  duration: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, required: true, default: Date.now },
});

export const VideoProgressModel = mongoose.model("VideoProgress", VideoProgressSchema);
