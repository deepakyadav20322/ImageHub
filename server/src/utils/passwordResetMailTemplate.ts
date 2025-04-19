

export const passwordResetTemplate =(resetToken:string)=> `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      line-height: 1.5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      padding: 30px 0;
      text-align: center;
    }
    .logo {
      height: 40px;
      margin-bottom: 15px;
    }
    .content {
      padding: 40px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 20px;
      color: #0f172a;
      text-align: center;
    }
    p {
      font-size: 16px;
      margin: 0 0 24px;
      color: #475569;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #fff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
      transition: all 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
    }
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 32px 0;
    }
    .footer {
      font-size: 14px;
      color: #64748b;
      text-align: center;
      padding: 0 40px 40px;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
    }
    .notice {
      background-color: #f8fafc;
      border-left: 4px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 0 4px 4px 0;
      margin: 32px 0;
      font-size: 14px;
    }
    .code {
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      color: #0f172a;
      background: #f1f5f9;
      padding: 8px 16px;
      border-radius: 6px;
      display: inline-block;
      margin: 10px 0;
    }
    .comp{
        padding: 0 32px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Replace with your logo -->
      <!-- <img src="https://yourdomain.com/logo-white.png" alt="Company Logo" class="logo"> -->
    </div>
    
    <div class="content">
      <h1>Reset Your Password</h1>
      
      <p>Hello there,</p>
      
      <p>We received a request to reset your password. Click the button below to create a new secure password:</p>
      
      <div class="button-container">
        <a href="${process.env.CLIENT_BASE_URL}/reset-password?token=${resetToken}" class="button">
          Reset Password
        </a>
      </div>
      
      <p>This link will expire in 24 hours for your security. If you didn't request this, please ignore this email.</p>
      
      <div class="notice">
        <strong>Important:</strong> Never share your password or this link with anyone. Our support team will never ask for it.
      </div>
      
      <div class="divider"></div>
      
      <p>If the button above doesn't work, copy and paste this link into your browser:</p>
      
     
    </div>
    <h5 class="comp">From MediaHub</h5>
   
  </div>
</body>
</html>`