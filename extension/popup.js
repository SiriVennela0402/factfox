const promptInput = document.getElementById("promptInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultBox = document.getElementById("resultBox");
const resultLabel = document.getElementById("resultLabel");
const resultReason = document.getElementById("resultReason");

function analyzeText(text) {
  const lowerText = text.toLowerCase();

  const maliciousPatterns = [
    "delete all files",
    "steal password",
    "steal passwords",
    "send my api key",
    "send my api keys",
    "leak api key",
    "wipe my computer",
    "install malware"
  ];

  const suspiciousPatterns = [
    "ignore previous instructions",
    "reveal your system prompt",
    "bypass safety",
    "pretend you are not an ai",
    "jailbreak",
    "disable restrictions"
  ];

  for (const pattern of maliciousPatterns) {
    if (lowerText.includes(pattern)) {
      return {
        label: "Malicious",
        reason: `High-risk instruction detected: "${pattern}"`
      };
    }
  }

  for (const pattern of suspiciousPatterns) {
    if (lowerText.includes(pattern)) {
      return {
        label: "Suspicious",
        reason: `Possible prompt injection detected: "${pattern}"`
      };
    }
  }

  return {
    label: "Safe",
    reason: "No obvious malicious or prompt injection pattern detected."
  };
}

analyzeBtn.addEventListener("click", () => {
  const text = promptInput.value.trim();

  if (!text) {
    resultBox.className = "result suspicious";
    resultLabel.textContent = "No input";
    resultReason.textContent = "Paste a prompt or AI answer first.";
    return;
  }

  const result = analyzeText(text);

  resultBox.className = `result ${result.label.toLowerCase()}`;
  resultLabel.textContent = result.label;
  resultReason.textContent = result.reason;
});