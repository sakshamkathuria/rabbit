const xlsx = require("xlsx");
const { parse } = require("csv-parse/sync");

/**
 * Parses a .csv or .xlsx buffer into a readable string table.
 * @param {Buffer} buffer
 * @param {string} filename
 * @returns {string}
 */
const parseFile = (buffer, filename) => {
  let rows = [];

  if (filename.endsWith(".csv")) {
    rows = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } else if (filename.endsWith(".xlsx")) {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rows = xlsx.utils.sheet_to_json(sheet);
  } else {
    throw new Error("Unsupported file type. Only .csv and .xlsx are allowed.");
  }

  if (!rows || rows.length === 0) {
    throw new Error("File is empty or could not be parsed.");
  }

  // Cap at 100 rows to stay within LLM token limits
  const limited = rows.slice(0, 100);

  // Build readable string table
  const headers = Object.keys(limited[0]).join(" | ");
  const divider = "-".repeat(headers.length);
  const dataRows = limited.map((row) =>
    Object.values(row).join(" | ")
  );

  return [headers, divider, ...dataRows].join("\n");
};

module.exports = { parseFile };