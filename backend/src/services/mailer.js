const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
});

/**
 * Sends the AI summary to recipient via SMTP.
 * @param {string} recipient
 * @param {string} summary
 * @returns {Promise<boolean>}
 */
const sendSummaryEmail = async (recipient, summary) => {
  const info = await transporter.sendMail({
    from: `"Sales Insight Automator" <${process.env.SMTP_FROM}>`,
    to: recipient,
    subject: "📊 Your Sales Insight Summary is Ready",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: auto; padding: 20px;">

        <div style="background: #1e293b; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">
            📊 Sales Insight Automator
          </h1>
          <p style="color: #94a3b8; margin: 6px 0 0;">
            Rabbitt AI — Executive Summary Report
          </p>
        </div>

        <div style="background: #f8fafc; padding: 28px; border: 1px solid #e2e8f0;
                    border-radius: 0 0 12px 12px;">
          <p style="color: #475569; font-size: 14px; margin-top: 0;">
            Your AI-generated sales summary is ready:
          </p>

          <div style="background: #fff; border: 1px solid #e2e8f0;
                      border-radius: 8px; padding: 20px;">
            <pre style="white-space: pre-wrap; font-size: 14px; color: #1e293b;
                        margin: 0; font-family: Arial, sans-serif; line-height: 1.7;">
${summary}
            </pre>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0; margin-top: 20px;">
            Generated automatically by Rabbitt AI Sales Insight Automator.
          </p>
        </div>

      </div>
    `,
  });

  return !!info.messageId;
};

module.exports = { sendSummaryEmail };