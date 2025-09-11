const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Temporary folder for code execution
const TMP_DIR = path.join(__dirname, "tmp_code");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

// Load configuration
const configPath = path.join(__dirname, "config.json");
let config = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
} catch (err) {
  console.error("Failed to load config.json:", err);
  process.exit(1);
}

app.use(express.json());

/**
 * Optimize code by removing patterns specified in config
 * @param {string} code
 * @param {Array<string>} patterns
 * @returns {string}
 */
function optimizeCode(code, patterns) {
  if (!patterns || !Array.isArray(patterns)) return code;
  patterns.forEach(pattern => {
    const regex = new RegExp(pattern, "gs");
    code = code.replace(regex, "");
  });
  return code;
}

app.post("/run", (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  const langConfig = config.languages?.[language.toLowerCase()];
  if (!langConfig) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const extension = langConfig.extension;
  const filename = `test.${extension}`;
  const filepath = path.join(TMP_DIR, filename);

  // Optimize code
  const optimizedCode = optimizeCode(code, langConfig.optimize?.patterns);

  // Special handling for Java class name
  const classname = language.toLowerCase() === "java" ? "Test" : "";

  fs.writeFileSync(filepath, optimizedCode);

  const command = langConfig.command
    .replace("{file}", filename)
    .replace("{classname}", classname);

  const dockerCmd = `docker run --rm -v ${TMP_DIR}:/tmp multi-lang-env ${command}`;

  exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
    // Always clean up the temporary file
    fs.unlink(filepath, err => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }

    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("CodeSaathi is running! 🚀"); // ✅ Added
});