// ── CORS ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Swagger)
      if (!origin) return callback(null, true);

      const allowed = process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || [];

      if (allowed.includes("*") || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "X-API-Key"],
  })
);