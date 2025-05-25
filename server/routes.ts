import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoProgressSchema, updateVideoProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get video progress for a user
  app.get("/api/progress/:userId/:videoId", async (req, res) => {
    try {
      const { userId, videoId } = req.params;

      if (!userId || !videoId) {
        return res.status(400).json({ error: "Missing userId or videoId" });
      }

      const progress = await storage.getVideoProgress(userId, videoId);

      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create or update video progress (upsert)
  app.post("/api/progress/:userId/:videoId", async (req, res) => {
    try {
      const { userId, videoId } = req.params;

      if (!userId || !videoId) {
        return res.status(400).json({ error: "Missing userId or videoId" });
      }

      // Combine params and body; ensure updatedAt is set
      const progressData = {
        ...req.body,
        userId,
        videoId,
        updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : new Date(),
      };

      // Validate incoming data against insert schema
      const validatedData = insertVideoProgressSchema.parse(progressData);

      const existingProgress = await storage.getVideoProgress(userId, videoId);

      let result;
      if (existingProgress) {
        // Update existing
        result = await storage.updateVideoProgress(userId, videoId, validatedData);
      } else {
        // Create new
        result = await storage.createVideoProgress(validatedData);
      }

      if (!result) {
        return res.status(500).json({ error: "Failed to save progress" });
      }

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }

      console.error("Error saving progress:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Partial update of video progress
  app.patch("/api/progress/:userId/:videoId", async (req, res) => {
    try {
      const { userId, videoId } = req.params;

      if (!userId || !videoId) {
        return res.status(400).json({ error: "Missing userId or videoId" });
      }

      // Patch data: merge params + body + updatedAt set
      const updateData = updateVideoProgressSchema.parse({
        ...req.body,
        userId,
        videoId,
        updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : new Date(),
      });

      const result = await storage.updateVideoProgress(userId, videoId, updateData);

      if (!result) {
        return res.status(404).json({ error: "Progress not found" });
      }

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }

      console.error("Error updating progress:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete video progress
  app.delete("/api/progress/:userId/:videoId", async (req, res) => {
    try {
      const { userId, videoId } = req.params;

      if (!userId || !videoId) {
        return res.status(400).json({ error: "Missing userId or videoId" });
      }

      const deleted = await storage.deleteVideoProgress(userId, videoId);

      if (!deleted) {
        return res.status(404).json({ error: "Progress not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting progress:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
