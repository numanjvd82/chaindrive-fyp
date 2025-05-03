import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { connectDb } from "./lib/db/sqlite";
import errorLogger from "./middlewares/errorLogger";
import { ensureAuthenticated } from "./middlewares/session";
import router from "./routes";
import { mqttHandler } from "./services/mqttHandler";
import socketServer from "./services/socketServer";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
socketServer(server);
mqttHandler();

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

app.use("/api/auth", router.auth);

app.use(ensureAuthenticated);

app.use("/api/users", router.user);
app.use("/api/wallet", router.wallet);
app.use("/api/dashboard", router.dashboard);
app.use("/api/conversations", router.conversation);
app.use("/api/messages", router.message);
app.use("/api/notifications", router.notification);
app.use("/api/listings", router.listing);
app.use("/api/rentals", router.rental);
app.use("/api/devices", router.device);
app.use("/api/locations", router.location);

const PORT = process.env.PORT || 3000;

connectDb();
server.listen(
  {
    port: PORT,
    host: "0.0.0.0",
  },
  () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  }
);

export default app;
