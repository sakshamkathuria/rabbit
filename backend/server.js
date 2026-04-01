require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Backend running   → http://localhost:${PORT}`);
  console.log(`📄 Swagger UI        → http://localhost:${PORT}/docs`);
  console.log(`❤️  Health check      → http://localhost:${PORT}/health`);
});
