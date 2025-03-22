import { Request, Response } from "express";
import { userModel } from "../../models/user";

export const signUp = async (req: Request, res: Response) => {
  const {
    role,
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    address,
    city,
    state,
  } = req.body;

  const files = req.files as {
    idCardFront?: Express.Multer.File[];
    idCardBack?: Express.Multer.File[];
    selfie?: Express.Multer.File[];
  };

  // Access files
  const idCardFront = files?.idCardFront?.[0].buffer;
  const idCardBack = files?.idCardBack?.[0].buffer;
  const selfie = files?.selfie?.[0].buffer;

  if (!idCardFront || !idCardBack || !selfie) {
    res.status(400).json({ message: "All files are required" });
    return;
  }

  try {
    await userModel.createOne({
      role,
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
      address,
      city,
      state,
      idCardFront,
      idCardBack,
      selfie,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
