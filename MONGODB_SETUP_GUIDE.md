# Complete MongoDB Atlas Setup Guide for LearnTrack

## 🚀 Step-by-Step MongoDB Atlas Connection

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free" or "Sign In"
3. Create account with email or sign in with Google/GitHub
4. Complete verification if required

### Step 2: Create a New Cluster
1. After login, click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to your users
5. Give your cluster a name (e.g., "LearnTrackCluster")
6. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" and version "5.5 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@learntrackcuster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your Application

#### 6.1 Install MongoDB Dependencies
```bash
npm install mongodb @neondatabase/serverless drizzle-orm
```

#### 6.2 Create Environment Variables
Create a `.env` file in your root directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@learntrackcuster.xxxxx.mongodb.net/learntrack?retryWrites=true&w=majority

# Replace <username> and <password> with your actual credentials
# Replace the cluster URL with your actual cluster URL
# Added database name "learntrack" to the URI
```

#### 6.3 Update Database Configuration
Replace the content in `server/storage.ts`:

```typescript
import { MongoClient, Db, Collection } from 'mongodb';
import { User, VideoProgress, InsertUser, InsertVideoProgress, UpdateVideoProgress } from '@shared/schema';

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
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    this.client = new MongoClient(uri);
    this.db = this.client.db('learntrack');
    this.users = this.db.collection('users');
    this.videoProgresses = this.db.collection('video_progress');
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      console.log('✅ Connected to MongoDB Atlas');
      
      // Create indexes for better performance
      await this.users.createIndex({ username: 1 }, { unique: true });
      await this.videoProgresses.createIndex({ userId: 1, videoId: 1 }, { unique: true });
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
      ...progress,
      id,
      createdAt: new Date(),
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
    const updated = {
      ...progress,
      updatedAt: new Date(),
    };

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
```

#### 6.4 Update Package.json Scripts
Add to your `package.json`:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production node dist/server/index.js",
    "db:test": "node -e \"require('./server/storage.js').storage.connect().then(() => console.log('✅ Database connection successful')).catch(err => console.error('❌ Database connection failed:', err))\""
  }
}
```

### Step 7: Test Your Connection

#### 7.1 Test Database Connection
```bash
npm run db:test
```
You should see: "✅ Database connection successful"

#### 7.2 Start Your Application
```bash
npm run dev
```

### Step 8: Verify Everything Works
1. Open your application in the browser
2. Play the video and watch progress being tracked
3. Check MongoDB Atlas dashboard:
   - Go to "Browse Collections"
   - You should see `learntrack` database
   - With `users` and `video_progress` collections
   - Data should appear as you use the app

## 🔧 Production Deployment Tips

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@learntrackcuster.xxxxx.mongodb.net/learntrack?retryWrites=true&w=majority
PORT=5000
```

### Security Best Practices
1. **Never commit `.env` files to Git**
2. **Use specific IP addresses** instead of 0.0.0.0/0 in production
3. **Create separate databases** for development/staging/production
4. **Use MongoDB Atlas backup** features
5. **Monitor connection limits** in Atlas dashboard

### Performance Optimization
1. **Create proper indexes** (already included in code above)
2. **Use connection pooling** (MongoDB driver handles this)
3. **Monitor database performance** in Atlas
4. **Set up alerts** for high CPU/memory usage

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Connection Errors
```
Error: MongoNetworkError: connection refused
```
**Solution:** Check your IP whitelist in Network Access

#### Authentication Errors
```
Error: Authentication failed
```
**Solution:** Verify username/password in connection string

#### Database Not Found
```
Error: ns not found
```
**Solution:** Database will be created automatically when first document is inserted

#### Environment Variable Issues
```
Error: MONGODB_URI environment variable is required
```
**Solution:** Ensure `.env` file exists and contains MONGODB_URI

### Testing Connection
Use this test script in your terminal:
```javascript
// test-connection.js
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = 'your-connection-string-here';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('learntrack');
    const collection = db.collection('test');
    await collection.insertOne({ test: 'data', timestamp: new Date() });
    console.log('✅ Write test successful!');
    
    const document = await collection.findOne({ test: 'data' });
    console.log('✅ Read test successful!', document);
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();
```

## 📊 MongoDB Atlas Dashboard Features

### Monitor Your Database
- **Real-time Metrics**: CPU, Memory, Connections
- **Query Performance**: Slow query analysis
- **Data Explorer**: Browse your collections
- **Backup & Restore**: Automated backups

### Scaling Options
- **Vertical Scaling**: Increase cluster tier (M10, M20, etc.)
- **Horizontal Scaling**: Add sharding (M10+)
- **Read Replicas**: Improve read performance

Your LearnTrack application is now ready for production with MongoDB Atlas! 🎉