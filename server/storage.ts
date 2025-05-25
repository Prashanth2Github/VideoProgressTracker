import type { User, InsertUser, VideoProgress, InsertVideoProgress, UpdateVideoProgress } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined>;
  createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress>;
  updateVideoProgress(userId: string, videoId: string, progress: Partial<UpdateVideoProgress>): Promise<VideoProgress | undefined>;
  deleteVideoProgress(userId: string, videoId: string): Promise<boolean>;
}

import { MongoStorage } from "./mongoStorage";

export const storage = new MongoStorage();
