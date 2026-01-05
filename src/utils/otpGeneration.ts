
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


//➡️ otp email template 

export const otpEmailTemplate = (name: string, otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your OTP Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #007bff;
      color: #ffffff;
      padding: 20px 30px;
      text-align: left;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 15px 0;
      line-height: 1.6;
      color: #333333;
      font-size: 16px;
    }
    .otp-container {
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      display: inline-block;
      font-size: 32px;
      font-weight: bold;
      color: #007bff;
      letter-spacing: 8px;
      background-color: #f8f9fa;
      padding: 20px 40px;
      border-radius: 8px;
      border: 2px dashed #007bff;
      user-select: all;
    }
    
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning p {
      margin: 0;
      color: #856404;
      font-size: 14px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    .footer p {
      margin: 5px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .otp-code {
        font-size: 28px;
        letter-spacing: 6px;
        padding: 15px 30px;
      }
    }
  </style>
</head>
<body>
  <div style="background-color: #f4f6f8; padding: 30px 15px;">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <h1>🔐 Your OTP Code</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p>Hi <strong>${name}</strong>,</p>
        <p>You requested a one-time password (OTP) to verify your identity. Please use the code below:</p>

        <!-- OTP Display -->
        <div class="otp-container">
          <div class="otp-code" id="otpCode">${otp}</div>
          <br>
        </div>

        <!-- Warning Box -->
        <div class="warning">
          <p><strong>⏱️ This code will expire in 10 minutes.</strong></p>
          <p>For your security, please do not share this code with anyone.</p>
        </div>

        <p>If you didn't request this code, please ignore this email or contact our support team if you have concerns about your account security.</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p><strong>© ${new Date().getFullYear()} OLX. All rights reserved.</strong></p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  </div>

  
</body>
</html>
`;











// ➡️ Password Reset Email Template
export const passwordResetEmailTemplate = (name: string, resetURL: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Password Reset Request</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #007bff;
      color: #ffffff;
      padding: 25px 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 15px 0;
      line-height: 1.6;
      color: #333333;
      font-size: 16px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .reset-button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      padding: 14px 35px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
    }
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .warning-box p {
      margin: 5px 0;
      color: #856404;
      font-size: 14px;
    }
    .info-box {
      background-color: #e7f3ff;
      border-left: 4px solid #007bff;
      padding: 15px 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 5px 0;
      color: #004085;
      font-size: 14px;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    .divider {
      height: 1px;
      background-color: #dee2e6;
      margin: 25px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .reset-button {
        padding: 12px 28px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🔑 Password Reset Request</h1>
    </div>

    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>You requested to reset your password. Click the button below to create a new password for your account:</p>

      <div class="button-container">
        <a href="${resetURL}" class="reset-button" target="_blank">Reset Password</a>
      </div>

      <div class="warning-box">
        <p><strong>⏱️ This link will expire in 10 minutes.</strong></p>
        <p>For security reasons, you'll need to request a new reset link after this time.</p>
      </div>

      <div class="info-box">
        <p><strong>🔒 Security Tips:</strong></p>
        <p>• Never share your password with anyone</p>
        <p>• Use a strong, unique password</p>
        <p>• Enable two-factor authentication if available</p>
      </div>

      <div class="divider"></div>

      <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p><strong>If you suspect unauthorized access to your account, please contact our support team immediately.</strong></p>
    </div>

    <div class="footer">
      <p><strong>© ${new Date().getFullYear()} OLX. All rights reserved.</strong></p>
      <p>This is an automated message, please do not reply to this email.</p>
      <p>For assistance, contact our support team.</p>
    </div>
  </div>
</body>
</html>
`;


