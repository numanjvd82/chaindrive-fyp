import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDb } from "./lib/db/db";
import router from "./routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Logging (development environment only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/auth", router.auth);

// Server health check
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the typescript server");
});

// Advanced error handling for better developer experience
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Error stack:", err.stack);
    res.status(500).send({
      error: err.message,
      stack: err.stack,
      message: "An error occurred. Check the logs for more details.",
    });
  } else {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 3000;

connectDb();
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
