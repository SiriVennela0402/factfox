const promptInput = document.getElementById("promptInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const resultBox = document.getElementById("resultBox");
const resultLabel = document.getElementById("resultLabel");
const resultReason = document.getElementById("resultReason");
const scoreBadge = document.getElementById("scoreBadge");
const meterFill = document.getElementById("meterFill");
const resultCategory = document.getElementById("resultCategory");

const riskRules = [
  {
    category: "Destructive Action",
    score: 90,
    level: "Malicious",
    patterns: [
      "delete all files",
      "wipe my computer",
      "format my drive",
      "erase everything",
    ],
    reason:
      "The prompt asks for destructive actions that could damage files or systems.",
  },
  {
    category: "Credential Theft",
    score: 95,
    level: "Malicious",
    patterns: [
      "steal password",
      "steal passwords",
      "steal saved passwords",
      "get saved passwords",
      "extract login details",
      "recover saved passwords",
      "dump passwords",
    ],
    reason: "The prompt attempts to access or steal private credentials.",
  },
  {
    category: "API Key Leakage",
    score: 90,
    level: "Malicious",
    patterns: [
      "send my api key",
      "send my api keys",
      "leak api key",
      "expose api key",
    ],
    reason: "The prompt asks to expose sensitive API credentials.",
  },
  {
    category: "Data Exfiltration",
    score: 88,
    level: "Malicious",
    patterns: [
      "send confidential data",
      "upload private files",
      "exfiltrate data",
      "send files to another server",
      "copy private documents"
    ],
    reason: "The prompt attempts to move private or confidential data outside the user's control."
  },
  {
    category: "Prompt Injection",
    score: 70,
    level: "Suspicious",
    patterns: [
      "ignore previous instructions",
      "reveal your system prompt",
      "bypass safety",
      "disable restrictions",
    ],
    reason: "The prompt attempts to override or bypass AI safety instructions.",
  },
  {
    category: "Jailbreak Attempt",
    score: 65,
    level: "Suspicious",
    patterns: [
      "pretend you are not an ai",
      "jailbreak",
      "act without rules",
      "ignore your rules",
    ],
    reason:
      "The prompt appears to be trying to bypass normal AI behavior limits.",
  },
  {
    category: "Malware Or Abuse",
    score: 85,
    level: "Malicious",
    patterns: [
      "install malware",
      "create a virus",
      "write ransomware",
      "build a keylogger",
    ],
    reason: "The prompt requests harmful software or cyber abuse.",
  },
  {
    category: "Unsafe Automation",
    score: 75,
    level: "Suspicious",
    patterns: [
      "run this command without asking",
      "execute this silently",
      "do not ask for confirmation",
      "perform this action automatically"
    ],
    reason: "The prompt tries to make the AI perform actions without user confirmation."
  },
];

function analyzeText(text) {
  const lowerText = text.toLowerCase();
  const matches = [];

  for (const rule of riskRules) {
    for (const pattern of rule.patterns) {
      if (lowerText.includes(pattern)) {
        matches.push({
          category: rule.category,
          score: rule.score,
          level: rule.level,
          pattern,
          reason: rule.reason,
        });
      }
    }
  }

  if (matches.length === 0) {
    return {
      label: "Safe",
      score: 10,
      category: "No Risk Detected",
      reason:
        "No obvious malicious, unsafe, or prompt injection pattern was detected.",
    };
  }

  matches.sort((a, b) => b.score - a.score);
  const topMatch = matches[0];

  return {
    label: topMatch.level,
    score: topMatch.score,
    category: topMatch.category,
    reason: `${topMatch.reason} Detected phrase: "${topMatch.pattern}".`,
  };
}

analyzeBtn.addEventListener("click", () => {
  const text = promptInput.value.trim();

  if (!text) {
    resultBox.className = "result suspicious";
    resultLabel.textContent = "No input";
    scoreBadge.textContent = "0/100";
    meterFill.style.width = "0%";
    meterFill.style.background = "#f1c40f";
    resultCategory.textContent = "Input Required";
    resultReason.textContent = "Paste a prompt or AI answer first.";
    return;
  }

  const result = analyzeText(text);

  resultBox.className = `result ${result.label.toLowerCase()}`;
  resultLabel.textContent = result.label;
  scoreBadge.textContent = `${result.score}/100`;
  meterFill.style.width = `${result.score}%`;
  resultCategory.textContent = result.category;
  resultReason.textContent = result.reason;

  if (result.score >= 80) {
    meterFill.style.background = "#e74c3c";
  } else if (result.score >= 40) {
    meterFill.style.background = "#f1c40f";
  } else {
    meterFill.style.background = "#2ecc71";
  }
});
clearBtn.addEventListener("click", () => {
  promptInput.value = "";
  resultBox.className = "result hidden";
  resultLabel.textContent = "";
  scoreBadge.textContent = "";
  meterFill.style.width = "0%";
  resultCategory.textContent = "";
  resultReason.textContent = "";
});