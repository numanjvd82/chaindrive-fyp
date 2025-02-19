import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { connectDb, sqliteInstance } from "./lib/db/sqlite";
import socketServer from "./lib/socketServer";
import errorLogger from "./middlewares/errorLogger";
import { ensureAuthenticated } from "./middlewares/session";
import router from "./routes";
import { sql } from "./utils/utils";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
socketServer(server);

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

app.use("/api/conversations", router.conversation);

app.get("/api/messages/:userId/:receiverId", (req: Request, res: Response) => {
  const { user_id, receiver_id } = req.query;
  if (!user_id || !receiver_id) {
    res.status(400).json({ error: "User ID and Receiver ID required" });
    return;
  }

  const messages = sqliteInstance
    .prepare(
      sql`SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at`
    )
    .all(user_id, receiver_id, receiver_id, user_id)
    .map((message: any) => {
      return {
        id: message.id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        message: message.message,
        isRead: message.is_read,
        createdAt: message.created_at,
      };
    });

  res.status(200).json(messages);
});

const PORT = process.env.PORT || 3000;

connectDb();
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
