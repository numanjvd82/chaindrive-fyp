import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDb } from "./lib/db/sqlite";
import errorLogger from "./middlewares/errorLogger";
import { ensureAuthenticated } from "./middlewares/session";
import router from "./routes";

dotenv.config();

const app = express();

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

app.use("/api/dashboard", ensureAuthenticated, (req, res) => {
  // @ts-expect-error Property 'userId' does not exist on type 'Request'
  res.status(200).json({ message: `Welcome, user ${req.userId}` });
});

const PORT = process.env.PORT || 3000;

connectDb();
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
