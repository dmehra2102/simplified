export const memberAddedSuccessfullyInWorkspaceTemplateContent = (memberName: string, workspaceName: string, adminName: string) => `
<html lang="en">
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">

<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <h2 style="color: #333333; text-align: center;">Welcome to the Team! You've Been Invited to ${workspaceName} 🎉</h2>
  <p>Dear ${memberName},</p>
  <p>Exciting news! You've been officially added to ${workspaceName} by ${adminName}, and we couldn't be more thrilled to welcome you aboard.</p>
  <p>Ready to dive in? Your journey with us starts now. Explore the workspace, connect with fellow members, and let's make magic happen.</p>
  <p>Welcome to ${workspaceName}! We're thrilled to have you on board.</p>
  <br>
  <p>Best regards,</p>
  <p>simplified<br>
</div>
`;
