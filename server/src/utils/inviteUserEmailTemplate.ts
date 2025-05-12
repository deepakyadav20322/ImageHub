export const inviteUserEmailTemplate = ({ firstName, lastName, tokenId }: { firstName: string, lastName: string, tokenId: string }) => `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>You're Invited</title>
    <style>
      :root {
        --brand-blue: #2563eb; 
        --brand-blue-dark: #1e40af;
      }
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
      }
        .blue-text{
        color:#2563eb;
        }
        .blue-bg{
        background:#2563eb;
        color:white;
        }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 32px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .button {
        display: inline-block;
        background-color: var(--brand-blue);
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        transition: background-color 0.2s ease;
      }
      .button:hover {
        background-color: var(--brand-blue-dark);
      }
      .footer {
        text-align: center;
        color: #6b7280;
        font-size: 14px;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2 style="color: var(--brand-blue);">You're Invited to Join MediaHub</h2>
      <p style="font-size: 16px; color: #374151;">
        Hello,  
        <br /><br />
        You've been invited by <strong>${firstName}-${lastName}</strong> to join <strong>MediaHub</strong>. Click the button below to accept your invitation and get started.
      </p>
      <p style="margin: 32px 0;">
        <a href="${process.env.CLIENT_BASE_URL}/invite-user/${tokenId}" class="button blue-bg">Accept Invitation</a>
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        If you were not expecting this invitation, you can safely ignore this email.
      </p>
    </div>

    <div class="footer">
      © 2025 MediaHub. All rights reserved.
    </div>
  </body>
</html>

        `
