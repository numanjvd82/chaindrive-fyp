import { Request, Response } from "express";
import { userModel } from "../../models/user";

export const signUp = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role } = req.body;

  await userModel.createOne({ first_name, last_name, email, password, role });

  res.status(201).json({ message: "User created successfully" });
};
