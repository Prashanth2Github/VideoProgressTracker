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
    console.log('✅ Video progress tracking system ready for your SDE assignment!');
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
      id,
      userId: progress.userId,
      videoId: progress.videoId,
      intervals: progress.intervals as [number, number][] || [],
      totalUniqueSeconds: progress.totalUniqueSeconds || 0,
      lastPosition: progress.lastPosition || 0,
      duration: progress.duration || 0,
      updatedAt: new Date(),
    };
    
    const key = this.getProgressKey(progress.userId, progress.videoId);
    this.videoProgresses.set(key, newProgress);
    
    console.log('✅ Progress saved successfully!', { 
      userId: progress.userId, 
      videoId: progress.videoId, 
      totalUnique: newProgress.totalUniqueSeconds,
      intervals: newProgress.intervals.length,
      percentage: Math.round((newProgress.totalUniqueSeconds / Math.max(newProgress.duration, 1)) * 100)
    });
    
    return newProgress;
  }

  async updateVideoProgress(userId: string, videoId: string, progress: Partial<UpdateVideoProgress>): Promise<VideoProgress | undefined> {
    const key = this.getProgressKey(userId, videoId);
    const existing = this.videoProgresses.get(key);
    
    if (!existing) {
      return undefined;
    }

    const updated: VideoProgress = {
      id: existing.id,
      userId: existing.userId,
      videoId: existing.videoId,
      intervals: (progress.intervals as [number, number][]) || existing.intervals,
      totalUniqueSeconds: progress.totalUniqueSeconds ?? existing.totalUniqueSeconds,
      lastPosition: progress.lastPosition ?? existing.lastPosition,
      duration: progress.duration ?? existing.duration,
      updatedAt: new Date(),
    };
    
    this.videoProgresses.set(key, updated);
    
    console.log('✅ Progress updated successfully!', { 
      userId, 
      videoId, 
      totalUnique: updated.totalUniqueSeconds,
      intervals: updated.intervals.length,
      percentage: Math.round((updated.totalUniqueSeconds / Math.max(updated.duration, 1)) * 100)
    });
    
    return updated;
  }

  async deleteVideoProgress(userId: string, videoId: string): Promise<boolean> {
    const key = this.getProgressKey(userId, videoId);
    const deleted = this.videoProgresses.delete(key);
    if (deleted) {
      console.log('✅ Progress deleted successfully:', { userId, videoId });
    }
    return deleted;
  }
}

export const storage = new MemStorage();