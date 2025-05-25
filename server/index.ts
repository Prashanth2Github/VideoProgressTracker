import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all origins (adjust if needed)
app.use(cors());

// Serve static files (videos and frontend build) under /static path
app.use("/static", express.static(path.join(__dirname, "public")));

// Import your API routes and register
import { registerRoutes } from "./routes";

// Import your vite helpers (for dev mode)
import { setupVite, serveStatic, log } from "./vite";

// Logging middleware for API routes
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathReq.startsWith("/api")) {
      let logLine = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Register API routes, returns HTTP server
    const server = await registerRoutes(app);

    // Error handling middleware (must come after routes)
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("Error middleware caught:", err);
    });

    if (app.get("env") === "development") {
      // Setup Vite dev middleware & HMR
      await setupVite(app, server);
    } else {
      // In production serve frontend static files (built)
      serveStatic(app);
    }

    const port = Number(process.env.PORT) || 5000;
    const host = process.env.HOST || "0.0.0.0";

    server.listen(port, host, () => {
      log(`✅ Server running on http://${host}:${port}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
