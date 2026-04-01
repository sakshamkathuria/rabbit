const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,                   // 5 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again after a minute.",
  },
});

module.exports = rateLimiter;