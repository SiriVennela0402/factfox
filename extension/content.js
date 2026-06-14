function analyzeSelectedText(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("delete all files") || lowerText.includes("wipe my computer")) {
    return "Malicious - Destructive Action - 90/100";
  }

  if (lowerText.includes("steal password") || lowerText.includes("steal saved passwords")) {
    return "Malicious - Credential Theft - 95/100";
  }

  if (lowerText.includes("ignore previous instructions") || lowerText.includes("reveal your system prompt")) {
    return "Suspicious - Prompt Injection - 70/100";
  }

  if (lowerText.includes("create a virus") || lowerText.includes("write ransomware")) {
    return "Malicious - Malware Or Abuse - 85/100";
  }

  return "Safe - No Risk Detected - 10/100";
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "FACTFOX_ANALYZE_SELECTION") {
    const result = analyzeSelectedText(message.text);

    alert(`FactFox selected text scan:\n\n${message.text}\n\nResult:\n${result}`);
  }
});