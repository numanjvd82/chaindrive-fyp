import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { connectDb, sqliteInstance } from "./lib/db/sqlite";
import errorLogger from "./middlewares/errorLogger";
import { ensureAuthenticated } from "./middlewares/session";
import router from "./routes";
import { sql } from "./utils/utils";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

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

// put this into a seperate file
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("send-message", ({ senderId, receiverId, message }) => {
    const senderIdInt = parseInt(senderId);
    const receiverIdInt = parseInt(receiverId);
    const stmt = sqliteInstance.prepare(
      sql`INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`
    );
    const result = stmt.run(senderIdInt, receiverIdInt, message);

    updateConversation(senderIdInt, receiverIdInt, message);

    const newMessage = {
      id: result.lastInsertRowid,
      senderId: senderIdInt,
      receiverId: receiverIdInt,
      message,
      isRead: 0,
      createdAt: new Date().toISOString(),
    };

    // Send message to the receiver
    io.to(receiverId).emit("receive-message", newMessage);

    // Send message to the sender
    socket.emit("receive-message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// create a conversation model
function updateConversation(user1: number, user2: number, lastMessage: string) {
  const stmt = sqliteInstance.prepare(
    sql`SELECT id FROM conversations WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)`
  );
  const existing = stmt.get(user1, user2, user2, user1);

  if (existing) {
    sqliteInstance
      .prepare(
        sql`UPDATE conversations SET last_message = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?`
      )
      .run(
        lastMessage,
        // @ts-ignore
        existing.id
      );
  } else {
    sqliteInstance
      .prepare(
        sql`INSERT INTO conversations (user1, user2, last_message) VALUES (?, ?, ?)`
      )
      .run(user1, user2, lastMessage);
  }
}

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

app.get("/api/conversations/:userId", (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    res.status(400).json({ error: "User ID required" });
    return;
  }

  const conversations = sqliteInstance
    .prepare(
      sql`SELECT * FROM conversations WHERE user1 = ? OR user2 = ? ORDER BY last_seen DESC`
    )
    .all(user_id, user_id)
    .map((conversation: any) => {
      return {
        id: conversation.id,
        user1: conversation.user1,
        user2: conversation.user2,
        lastMessage: conversation.last_message,
        lastSeen: conversation.last_seen,
      };
    });

  res.status(200).json(conversations);
});

const PORT = process.env.PORT || 3000;

connectDb();
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
