import { MongoClient, Db, Collection } from 'mongodb';
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

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private users: Collection<User>;
  private videoProgresses: Collection<VideoProgress>;
  private isConnected: boolean = false;

  constructor() {
    const password = process.env.MONGODB_PASSWORD;
    if (!password) {
      throw new Error('MONGODB_PASSWORD environment variable is required');
    }
    
    const uri = `mongodb+srv://bonkuruprashanth123:${password}@videotrackercluster.vshj1q8.mongodb.net/learntrack?retryWrites=true&w=majority`;
    
    this.client = new MongoClient(uri);
    this.db = this.client.db('learntrack');
    this.users = this.db.collection('users');
    this.videoProgresses = this.db.collection('video_progress');
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.isConnected = true;
        console.log('✅ Connected to MongoDB Atlas successfully!');
        
        // Create indexes for better performance
        await this.users.createIndex({ username: 1 }, { unique: true });
        await this.videoProgresses.createIndex({ userId: 1, videoId: 1 }, { unique: true });
      } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB Atlas');
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    await this.connect();
    const user = await this.users.findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.connect();
    const user = await this.users.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.connect();
    const id = await this.getNextUserId();
    const user: User = { ...insertUser, id };
    
    await this.users.insertOne(user);
    return user;
  }

  private async getNextUserId(): Promise<number> {
    const lastUser = await this.users.findOne({}, { sort: { id: -1 } });
    return (lastUser?.id || 0) + 1;
  }

  async getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined> {
    await this.connect();
    const progress = await this.videoProgresses.findOne({ userId, videoId });
    return progress || undefined;
  }

  async createVideoProgress(progress: InsertVideoProgress): Promise<VideoProgress> {
    await this.connect();
    const id = await this.getNextProgressId();
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

    await this.videoProgresses.insertOne(newProgress);
    return newProgress;
  }

  private async getNextProgressId(): Promise<number> {
    const lastProgress = await this.videoProgresses.findOne({}, { sort: { id: -1 } });
    return (lastProgress?.id || 0) + 1;
  }

  async updateVideoProgress(userId: string, videoId: string, progress: Partial<UpdateVideoProgress>): Promise<VideoProgress | undefined> {
    await this.connect();
    const updated: any = {
      updatedAt: new Date(),
    };

    if (progress.intervals !== undefined) updated.intervals = progress.intervals;
    if (progress.totalUniqueSeconds !== undefined) updated.totalUniqueSeconds = progress.totalUniqueSeconds;
    if (progress.lastPosition !== undefined) updated.lastPosition = progress.lastPosition;
    if (progress.duration !== undefined) updated.duration = progress.duration;

    const result = await this.videoProgresses.findOneAndUpdate(
      { userId, videoId },
      { $set: updated },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  async deleteVideoProgress(userId: string, videoId: string): Promise<boolean> {
    await this.connect();
    const result = await this.videoProgresses.deleteOne({ userId, videoId });
    return result.deletedCount > 0;
  }
}

export const storage = new MongoStorage();

// Graceful shutdown
process.on('SIGINT', async () => {
  await storage.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await storage.disconnect();
  process.exit(0);
});