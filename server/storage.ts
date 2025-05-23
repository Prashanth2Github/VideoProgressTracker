import { users, videoProgress, type User, type InsertUser, type VideoProgress, type InsertVideoProgress, type UpdateVideoProgress } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined>;
  createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress>;
  updateVideoProgress(userId: string, videoId: string, progress: Partial<UpdateVideoProgress>): Promise<VideoProgress | undefined>;
  deleteVideoProgress(userId: string, videoId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videoProgresses: Map<string, VideoProgress>;
  private currentUserId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.videoProgresses = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  private getProgressKey(userId: string, videoId: string): string {
    return `${userId}:${videoId}`;
  }

  async getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined> {
    const key = this.getProgressKey(userId, videoId);
    return this.videoProgresses.get(key);
  }

  async createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress> {
    const id = this.currentProgressId++;
    const newProgress: VideoProgress = {
      ...progress,
      id,
      updatedAt: new Date(),
    };
    
    const key = this.getProgressKey(progress.userId, progress.videoId);
    this.videoProgresses.set(key, newProgress);
    return newProgress;
  }

  async updateVideoProgress(userId: string, videoId: string, progress: Partial<UpdateVideoProgress>): Promise<VideoProgress | undefined> {
    const key = this.getProgressKey(userId, videoId);
    const existing = this.videoProgresses.get(key);
    
    if (!existing) {
      return undefined;
    }

    const updated: VideoProgress = {
      ...existing,
      ...progress,
      updatedAt: new Date(),
    };
    
    this.videoProgresses.set(key, updated);
    return updated;
  }

  async deleteVideoProgress(userId: string, videoId: string): Promise<boolean> {
    const key = this.getProgressKey(userId, videoId);
    return this.videoProgresses.delete(key);
  }
}

export const storage = new MemStorage();
