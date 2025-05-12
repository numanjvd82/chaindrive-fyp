export function otpSentEmailTemplate(otp: string, email: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .otp-box {
          display: inline-block;
          background-color: #f0f0f0;
          padding: 15px 25px;
          font-size: 24px;
          letter-spacing: 10px;
          font-weight: bold;
          border-radius: 8px;
          margin: 20px auto;
        }
        .footer {
          font-size: 12px;
          color: #999999;
          text-align: center;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>OTP Verification</h2>
        </div>
        <p>Hello,</p>
        <p>We received a request to verify your email address <strong>${email}</strong>.</p>
        <p>Please use the following One-Time Password (OTP) to proceed:</p>

        <div class="otp-box">
          ${otp}
        </div>

        <p>This otp will be expired in 2 minutes</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Thank you,<br/>The Team</p>

        <div class="footer">
          This is an automated message, please do not reply.
        </div>
      </div>
    </body>
  </html>
  `;
}
