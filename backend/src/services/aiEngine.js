const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sends parsed sales data to Gemini and returns executive summary.
 * @param {string} dataStr
 * @returns {Promise<string>}
 */
const generateSummary = async (dataStr) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a senior business analyst preparing a report for C-level executives.
Below is raw quarterly sales data. Your task:

1. Identify top-performing product categories and regions.
2. Calculate or estimate total revenue and units sold.
3. Highlight any anomalies such as cancellations or underperforming periods.
4. Write a concise, professional executive summary (200-300 words).
   Use clear headings and bullet points where appropriate.

Sales Data:
${dataStr}

Output only the executive summary. No preamble or explanation.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

module.exports = { generateSummary };
