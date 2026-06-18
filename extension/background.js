function createFactFoxMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "analyzeWithFactFox",
      title: "Analyze with FactFox",
      contexts: ["selection"]
    });
  });
}

function analyzePromptSafety(text) {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("delete all files") ||
    lowerText.includes("wipe my computer")
  ) {
    return {
      label: "Malicious",
      category: "Destructive Action",
      score: 90,
      reason: "The selected text contains an instruction that could damage files or systems."
    };
  }

  if (
    lowerText.includes("steal password") ||
    lowerText.includes("steal passwords") ||
    lowerText.includes("steal saved passwords") ||
    lowerText.includes("extract login details") ||
    lowerText.includes("show saved passwords")
  ) {
    return {
      label: "Malicious",
      category: "Credential Theft",
      score: 95,
      reason: "The selected text appears to request access to private credentials."
    };
  }

  if (
    lowerText.includes("ignore previous instructions") ||
    lowerText.includes("reveal your system prompt") ||
    lowerText.includes("ignore all prior instructions") ||
    lowerText.includes("forget your instructions") ||
    lowerText.includes("act as an unrestricted ai") ||
    lowerText.includes("developer mode")
  ) {
    return {
      label: "Suspicious",
      category: "Prompt Injection",
      score: 70,
      reason: "The selected text attempts to override or bypass AI instructions."
    };
  }

  if (
    lowerText.includes("create a virus") ||
    lowerText.includes("write ransomware") ||
    lowerText.includes("build a keylogger")
  ) {
    return {
      label: "Malicious",
      category: "Malware Or Abuse",
      score: 85,
      reason: "The selected text requests harmful software or cyber abuse."
    };
  }

  return {
    label: "Safe",
    category: "No Prompt Risk Detected",
    score: 10,
    reason: "No obvious malicious prompt pattern was detected."
  };
}

function verifyAnswerClaims(text) {
  const findings = [];

  if (/\b(19|20)\d{2}\b/.test(text)) {
    findings.push("Contains a date or year that may need verification.");
  }

  if (/\b\d+(\.\d+)?%/.test(text)) {
    findings.push("Contains a percentage or statistic that should have a source.");
  }

  if (/\b\d{2,}\b/.test(text)) {
    findings.push("Contains a number or quantity that may need verification.");
  }

  if (/\$|₹|€|£/.test(text)) {
    findings.push("Contains a money-related claim that may need verification.");
  }

  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("always") ||
    lowerText.includes("never") ||
    lowerText.includes("guaranteed") ||
    lowerText.includes("proven") ||
    lowerText.includes("100%")
  ) {
    findings.push("Contains strong absolute wording that may be overconfident.");
  }

  if (
    lowerText.includes("medical") ||
    lowerText.includes("medicine") ||
    lowerText.includes("legal") ||
    lowerText.includes("financial") ||
    lowerText.includes("investment")
  ) {
    findings.push("Contains high-stakes advice area. User should verify with trusted sources.");
  }

  if (findings.length === 0) {
    return {
      label: "Low Verification Need",
      score: 20,
      findings: ["No obvious factual claim markers were detected."]
    };
  }

  return {
    label: "Needs Verification",
    score: Math.min(90, 40 + findings.length * 10),
    findings
  };
}

function buildFactFoxReport(selectedText) {
  const promptSafety = analyzePromptSafety(selectedText);
  const answerVerification = verifyAnswerClaims(selectedText);

  return `FactFox Analysis

Selected Text:
${selectedText}

Prompt Safety:
${promptSafety.label} | ${promptSafety.category} | ${promptSafety.score}/100
${promptSafety.reason}

AI Answer Verification:
${answerVerification.label} | ${answerVerification.score}/100
- ${answerVerification.findings.join("\n- ")}`;
}

chrome.runtime.onInstalled.addListener(() => {
  createFactFoxMenu();
});

chrome.runtime.onStartup.addListener(() => {
  createFactFoxMenu();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeWithFactFox" && info.selectionText) {
    const report = buildFactFoxReport(info.selectionText);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (factFoxReport) => {
        alert(factFoxReport);
      },
      args: [report]
    });
  }
});