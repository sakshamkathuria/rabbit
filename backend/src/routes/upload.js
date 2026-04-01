const express = require("express");
const multer = require("multer");
const { parseFile } = require("../services/parser");
const { generateSummary } = require("../services/aiEngine");
const { sendSummaryEmail } = require("../services/mailer");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Multer config — memory storage, 5MB max, csv/xlsx only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed =
      file.originalname.endsWith(".csv") ||
      file.originalname.endsWith(".xlsx");
    if (allowed) {
      cb(null, true);
    } else {
      cb(new Error("Only .csv and .xlsx files are accepted."), false);
    }
  },
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload sales file and trigger AI summary email
 *     tags: [Sales Insight]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Sales data file (.csv or .xlsx, max 5MB)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *     responses:
 *       200:
 *         description: Summary generated and email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Summary sent to user@example.com
 *       400:
 *         description: Bad request — missing file or invalid email
 *       403:
 *         description: Forbidden — invalid or missing API key
 *       413:
 *         description: File too large (max 5MB)
 *       429:
 *         description: Too many requests — rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.post(
  "/upload",
  rateLimiter,
  apiKeyAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      // 1. Check file exists
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // 2. Validate email
      const { email } = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "A valid recipient email is required." });
      }

      // 3. Parse the file
      const dataStr = parseFile(req.file.buffer, req.file.originalname);

      // 4. Generate AI summary
      const summary = await generateSummary(dataStr);

      // 5. Send email
      await sendSummaryEmail(email, summary);

      return res.status(200).json({
        status: "success",
        message: `Summary generated and sent to ${email}`,
      });

    } catch (err) {
      console.error("Upload error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;