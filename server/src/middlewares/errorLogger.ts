import { NextFunction, Request, Response } from "express";

export default function errorLogger(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV === "development") {
    console.error("Error stack:", err.stack);
    res.status(500).send({
      error: err.message,
      stack: err.stack,
      message: "An error occurred. Check the logs for more details.",
    });
    next();
  } else {
    res.status(500).send({
      error: "Internal Server Error",
    });
    next();
  }
}
