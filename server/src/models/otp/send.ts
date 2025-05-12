import nodemailer from "nodemailer";
import { otpModel } from ".";
import { otpSentEmailTemplate } from "../../lib/templates/otp-sent-email";
import { GenerateOtpInput } from "./generate";
require("dotenv").config();

type SendOtpInput = GenerateOtpInput;

export async function send(input: SendOtpInput) {
  try {
    const otp = await otpModel.generate(input);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const sentEmail = await transporter.sendMail({
      from: `From ChainDrive <${process.env.SMTP_EMAIL}>`,
      to: input.email,
      subject: "Your OTP Code for ChainDrive",
      html: otpSentEmailTemplate(otp, input.email),
    });

    if (sentEmail.rejected.length > 0) {
      throw new Error("Failed to send OTP email");
    }
    console.log("OTP email sent successfully:", sentEmail.response);

    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to send OTP");
  }
}
