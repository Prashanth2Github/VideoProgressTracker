// mongoStorage.ts

import mongoose, { Schema, model, Document } from "mongoose";
import dotenv from "dotenv";

import type {
  User,
  InsertUser,
  VideoProgress,
  InsertVideoProgress,
  UpdateVideoProgress,
} from "@shared/schema";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable not set");
}

// Connect to MongoDB once when this module loads
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Define Mongoose schemas and models

interface IUserDoc extends User, Document {}
interface IVideoProgressDoc extends VideoProgress, Document {}

const UserSchema = new Schema<IUserDoc>({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const VideoProgressSchema = new Schema<IVideoProgressDoc>({
  userId: { type: String, required: true, index: true },
  videoId: { type: String, required: true, index: true },

  // Replace 'progress' with correct fields
  intervals: {
    type: [
      {
        type: [Number], // Array of two numbers [start, end]
        validate: {
          validator: (arr: unknown) =>
            Array.isArray(arr) &&
            arr.length === 2 &&
            arr.every((num) => typeof num === "number"),
          message: "Intervals must be arrays of two numbers",
        },
      },
    ],
    required: true,
  },

  totalUniqueSeconds: { type: Number, required: true, default: 0 },
  lastPosition: { type: Number, required: true, default: 0 },
  duration: { type: Number, required: true, default: 0 },

  updatedAt: { type: Date, required: true, default: () => new Date() },
});

// Compound index to enforce uniqueness of userId + videoId
VideoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

const UserModel = model<IUserDoc>("User", UserSchema);
const VideoProgressModel = model<IVideoProgressDoc>("VideoProgress", VideoProgressSchema);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined>;
  createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress>;
  updateVideoProgress(
    userId: string,
    videoId: string,
    progress: Partial<UpdateVideoProgress>
  ): Promise<VideoProgress | undefined>;
  deleteVideoProgress(userId: string, videoId: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return UserModel.findOne({ id }).lean();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return UserModel.findOne({ username }).lean();
  }

  async createUser(user: InsertUser): Promise<User> {
    const createdUser = new UserModel(user);
    await createdUser.save();
    return createdUser.toObject();
  }

  async getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined> {
    return VideoProgressModel.findOne({ userId, videoId }).lean();
  }

  async createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress> {
    const created = new VideoProgressModel(progress);
    await created.save();
    return created.toObject();
  }

  async updateVideoProgress(
    userId: string,
    videoId: string,
    progress: Partial<UpdateVideoProgress>
  ): Promise<VideoProgress | undefined> {
    const updated = await VideoProgressModel.findOneAndUpdate(
      { userId, videoId },
      { $set: progress },
      { new: true }
    ).lean();
    return updated ?? undefined;
  }

  async deleteVideoProgress(userId: string, videoId: string): Promise<boolean> {
    const result = await VideoProgressModel.deleteOne({ userId, videoId });
    return result.deletedCount === 1;
  }
}
