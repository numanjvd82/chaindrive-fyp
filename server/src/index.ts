import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { connectDb, runMigrations } from "./lib/db/sqlite";
import errorLogger from "./middlewares/errorLogger";
import { ensureAuthenticated } from "./middlewares/session";
import router from "./routes";
import { mqttHandler } from "./services/mqttHandler";
import socketServer from "./services/socketServer";
import {
  checkDatabaseHealth,
  printHealthCheckReport,
} from "./utils/databaseHealth";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(errorLogger);

// Logging (development environment only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Server health check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

// Database health check endpoint
app.get("/api/health/database", async (req: Request, res: Response) => {
  try {
    const healthCheck = await checkDatabaseHealth();
    res.status(healthCheck.isHealthy ? 200 : 500).json({
      healthy: healthCheck.isHealthy,
      tables: healthCheck.tables,
      errors: healthCheck.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      healthy: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/auth", router.auth);
app.use("/api/otp", router.otp);

app.use(ensureAuthenticated);

app.use("/api/users", router.user);
app.use("/api/wallet", router.wallet);
app.use("/api/dashboard", router.dashboard);
app.use("/api/conversations", router.conversation);
app.use("/api/messages", router.message);
app.use("/api/notifications", router.notification);
app.use("/api/listings", router.listing);
app.use("/api/rentals", router.rental);
app.use("/api/violations", router.violation);
app.use("/api/devices", router.device);
app.use("/api/locations", router.location);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Step 1: Connect to database
    console.log("Connecting to database...");
    connectDb();

    // Step 2: Run migrations
    console.log("Running database migrations...");
    await runMigrations();

    // Step 3: Verify database health
    console.log("Checking database health...");
    const healthCheck = await checkDatabaseHealth();
    printHealthCheckReport(healthCheck);

    if (!healthCheck.isHealthy) {
      throw new Error(
        "Database health check failed. Please check the errors above."
      );
    }

    // Step 4: Initialize services that depend on database
    console.log("Initializing services...");
    socketServer(server);
    mqttHandler();

    // Step 5: Start the server
    server.listen(
      {
        port: PORT,
        host: "0.0.0.0",
      },
      () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log("All services initialized successfully");
      }
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    console.error("Please check your database configuration and try again");

    // If it's a database-related error, suggest running migrations
    if (error instanceof Error && error.message.includes("no such table")) {
      console.error(
        "It seems like database tables are missing. Try running: npm run migrate"
      );
    }

    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
