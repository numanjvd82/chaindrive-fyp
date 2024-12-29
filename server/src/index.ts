import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDb } from "./lib/db/db";
import errorLogger from "./middlewares/errorLogger";
import router from "./routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(errorLogger);

// Logging (development environment only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Server health check
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the typescript server");
});

app.use("/auth", router.auth);

const PORT = process.env.PORT || 3000;

connectDb();
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
