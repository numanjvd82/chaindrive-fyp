import { Request, Response, Router } from "express";
import passport from "passport";
import { getDbInstance } from "../../lib/db/db";
import { hashPassword } from "../../utils/cryptoUtils";
import { sql } from "../../utils/utils";

const authRouter = Router();

authRouter.post("/signup", (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role } = req.body;
  const db = getDbInstance();
  try {
    const { salt, hash } = hashPassword(password);

    db.prepare(
      sql`
INSERT INTO Users (first_name, last_name, email, password_hash, salt, role)
VALUES (?, ?, ?, ?, ?, ?)
`
    ).run(first_name, last_name, email, hash, salt, role);

    res.status(201).send({ message: "User created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create user" });
  }
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true, // Optional if you use flash middleware
  })
);

authRouter.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to logout" });
    }
    res.status(200).send({ message: "Logged out successfully!" });
  });
});

export default authRouter;
