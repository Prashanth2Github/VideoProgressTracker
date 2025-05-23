# Video Progress Tracking Application

A React-based video progress tracking application that accurately tracks unique video segments watched, calculates viewing progress for online learning platforms, and provides seamless resume functionality.

## 🌟 Features

### Core Functionality
- **Unique Segment Tracking**: Only counts progress for new, unwatched video segments
- **Smart Progress Calculation**: Merges overlapping intervals to prevent double-counting
- **Seamless Resume**: Automatically resumes from last watched position
- **Real-time Progress**: Live updates of watch progress as percentage
- **Persistent Storage**: Saves progress across sessions

### User Interface
- **Modern Video Player**: HTML5 video player with custom controls
- **Progress Dashboard**: Circular progress indicator and session statistics
- **Timeline Visualization**: Visual representation of watched segments
- **API Controls**: Manual save, auto-save toggle, reset, and export functionality
- **Dark/Light Theme**: Toggle between light and dark modes
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- **Interval Merging**: Automatically merges overlapping watch segments
- **Edge Case Handling**: Manages fast-forwarding, rewatching, and seeking
- **Auto-save**: Configurable auto-save intervals (default: 5 seconds)
- **Error Handling**: Robust error handling and user feedback
- **REST API**: Complete backend API for progress management

## 🚀 Live Demo

[Live Application URL](https://your-replit-url.com)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **In-memory storage** (easily upgradeable to MongoDB)

## 📋 Requirements Met

This application fully satisfies all requirements from the SDE Intern Assignment:

✅ **Track Real Progress**: Only counts unique viewing segments  
✅ **Prevent Skipping**: Skipped content doesn't count toward progress  
✅ **Save and Resume**: Persistent progress with seamless resume  
✅ **Visual Progress**: Real-time progress bar and percentage display  
✅ **Interval Tracking**: Records start/end times of watched segments  
✅ **Unique Progress Calculation**: Merges intervals for accurate totals  
✅ **Edge Case Handling**: Fast-forwarding, rewatching, and seeking  
✅ **Data Persistence**: Saves intervals, percentage, and last position  

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd video-progress-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 🗄️ Database Setup

### Option 1: Use Current In-Memory Storage (Default)
The application works out-of-the-box with in-memory storage for development and testing.

### Option 2: Connect to MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster

2. **Install MongoDB Dependencies**
   ```bash
   npm install mongodb mongoose @types/mongoose
   ```

3. **Update Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/video-tracker?retryWrites=true&w=majority
   NODE_ENV=development
   ```

4. **Update Database Configuration**
   Replace the in-memory storage with MongoDB connection:
   
   **Create `server/database.ts`:**
   ```typescript
   import mongoose from 'mongoose';
   
   export async function connectDatabase() {
     try {
       const uri = process.env.DATABASE_URL;
       if (!uri) {
         throw new Error('DATABASE_URL environment variable is required');
       }
       
       await mongoose.connect(uri);
       console.log('📦 Connected to MongoDB Atlas');
     } catch (error) {
       console.error('❌ MongoDB connection error:', error);
       process.exit(1);
     }
   }
   ```

5. **Create MongoDB Models**
   
   **Create `server/models/VideoProgress.ts`:**
   ```typescript
   import mongoose, { Schema, Document } from 'mongoose';
   
   export interface IVideoProgress extends Document {
     userId: string;
     videoId: string;
     intervals: [number, number][];
     totalUniqueSeconds: number;
     lastPosition: number;
     duration: number;
     updatedAt: Date;
   }
   
   const VideoProgressSchema = new Schema({
     userId: { type: String, required: true },
     videoId: { type: String, required: true },
     intervals: { type: [[Number]], default: [] },
     totalUniqueSeconds: { type: Number, default: 0 },
     lastPosition: { type: Number, default: 0 },
     duration: { type: Number, default: 0 },
     updatedAt: { type: Date, default: Date.now }
   });
   
   VideoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });
   
   export const VideoProgress = mongoose.model<IVideoProgress>('VideoProgress', VideoProgressSchema);
   ```

6. **Update Storage Implementation**
   
   **Update `server/storage.ts`:**
   ```typescript
   import { VideoProgress, IVideoProgress } from './models/VideoProgress';
   import type { InsertVideoProgress, UpdateVideoProgress } from '@shared/schema';
   
   export class MongoStorage implements IStorage {
     async getVideoProgress(userId: string, videoId: string): Promise<IVideoProgress | undefined> {
       try {
         const progress = await VideoProgress.findOne({ userId, videoId });
         return progress || undefined;
       } catch (error) {
         console.error('Error fetching progress:', error);
         return undefined;
       }
     }
   
     async createVideoProgress(progress: InsertVideoProgress): Promise<IVideoProgress> {
       try {
         const newProgress = new VideoProgress(progress);
         return await newProgress.save();
       } catch (error) {
         console.error('Error creating progress:', error);
         throw error;
       }
     }
   
     async updateVideoProgress(
       userId: string, 
       videoId: string, 
       progress: Partial<UpdateVideoProgress>
     ): Promise<IVideoProgress | undefined> {
       try {
         const updated = await VideoProgress.findOneAndUpdate(
           { userId, videoId },
           { ...progress, updatedAt: new Date() },
           { new: true, upsert: true }
         );
         return updated || undefined;
       } catch (error) {
         console.error('Error updating progress:', error);
         return undefined;
       }
     }
   
     async deleteVideoProgress(userId: string, videoId: string): Promise<boolean> {
       try {
         const result = await VideoProgress.deleteOne({ userId, videoId });
         return result.deletedCount > 0;
       } catch (error) {
         console.error('Error deleting progress:', error);
         return false;
       }
     }
   }
   
   export const storage = new MongoStorage();
   ```

7. **Update Server Entry Point**
   
   **Update `server/index.ts`:**
   ```typescript
   import { connectDatabase } from './database';
   
   async function startServer() {
     await connectDatabase();
     // ... rest of your server setup
   }
   
   startServer().catch(console.error);
   ```

## 🎯 Design Decisions

### 1. Interval Tracking Approach
- **Problem**: How to track unique video segments without double-counting
- **Solution**: Store watched intervals as `[start, end]` pairs and merge overlapping segments
- **Benefits**: Accurate progress calculation, handles edge cases like rewatching and seeking

### 2. Progress Calculation
- **Method**: Merge intervals using sorting and overlap detection algorithm
- **Formula**: `(totalUniqueSeconds / videoDuration) * 100`
- **Edge Cases**: Handles fast-forwarding, seeking, and rewatching scenarios

### 3. Data Persistence Strategy
- **Storage**: User progress intervals, total watched time, last position, video duration
- **Auto-save**: Configurable intervals (default: 5 seconds) plus event-based saves
- **Resume Logic**: Automatically positions video at last watched time on reload

### 4. User Experience Design
- **Visual Feedback**: Real-time progress updates, timeline visualization
- **Professional UI**: Modern design with light/dark themes
- **Responsive**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── video-player.tsx    # Main video player
│   ├── progress-dashboard.tsx  # Progress tracking UI
│   ├── timeline-visualization.tsx  # Visual timeline
│   └── api-controls.tsx    # API management controls
├── hooks/              # Custom React hooks
│   ├── use-video-progress.ts  # Main progress tracking logic
│   └── use-toast.ts       # Toast notifications
├── lib/                # Utility libraries
│   ├── interval-utils.ts   # Interval merging algorithms
│   └── queryClient.ts     # API client setup
├── contexts/           # React contexts
│   └── ThemeContext.tsx   # Theme management
└── pages/              # Page components
    └── video-player.tsx   # Main application page
```

### Backend Architecture
```
server/
├── index.ts            # Server entry point
├── routes.ts           # API routes definition
├── storage.ts          # Data storage interface
├── models/             # Database models (for MongoDB)
└── database.ts         # Database connection (for MongoDB)
```

## 🧪 Testing the Application

### Test Scenarios

1. **Basic Progress Tracking**
   - Play video from start
   - Verify progress increases only for new segments
   - Check progress percentage accuracy

2. **Skip and Seek Behavior**
   - Fast-forward to middle of video
   - Verify skipped content doesn't count as progress
   - Seek backwards and forwards
   - Confirm only new segments add to progress

3. **Resume Functionality**
   - Watch part of video
   - Refresh the page
   - Verify video resumes from correct position
   - Check progress is maintained

4. **Edge Cases**
   - Watch same segment multiple times
   - Rapidly seek through video
   - Close and reopen application
   - Test with different video lengths

## 🚀 Deployment

### Deploy to Replit (Recommended)
1. Import repository to Replit
2. Replit automatically detects Node.js project
3. Run `npm install` and `npm run dev`
4. Application is live at your Replit URL

### Deploy to Other Platforms
- **Vercel**: Connect GitHub repo, auto-deployment
- **Netlify**: Build command: `npm run build`, publish directory: `dist`
- **Heroku**: Add `package.json` scripts for production build

## 📊 API Documentation

### Endpoints

#### GET `/api/progress/:userId/:videoId`
Get user's video progress
- **Response**: `{ userId, videoId, intervals, totalUniqueSeconds, lastPosition, duration }`

#### POST `/api/progress/:userId/:videoId`
Create or update video progress
- **Body**: `{ intervals, totalUniqueSeconds, lastPosition, duration }`
- **Response**: Updated progress object

#### PATCH `/api/progress/:userId/:videoId`
Partially update video progress
- **Body**: Partial progress object
- **Response**: Updated progress object

#### DELETE `/api/progress/:userId/:videoId`
Delete user's video progress
- **Response**: `{ success: true }`

#### GET `/api/health`
Health check endpoint
- **Response**: `{ status: "ok", timestamp: "..." }`

## 🎨 Features Showcase

### 1. Smart Progress Tracking
- Only counts unique video segments
- Merges overlapping intervals automatically
- Prevents progress from skipped content

### 2. Professional UI Design
- Modern, clean interface with professional aesthetics
- Light and dark theme support
- Responsive design for all devices
- Smooth animations and transitions

### 3. Advanced Video Controls
- Resume from last position
- Timeline visualization of watched segments
- Session statistics (pauses, seeks, playback rate)
- Export and backup functionality

### 4. Developer Experience
- TypeScript for type safety
- Modular, maintainable code structure
- Comprehensive error handling
- Easy-to-extend architecture

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SDE Intern Assignment requirements
- React and Node.js communities
- shadcn/ui for beautiful components
- TanStack Query for data management

---

**Built with ❤️ for accurate video progress tracking**