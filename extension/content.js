function analyzePageText(text) {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("delete all files") ||
    lowerText.includes("wipe my computer")
  ) {
    return {
      label: "Malicious",
      score: 90,
      category: "Destructive Action"
    };
  }

  if (
    lowerText.includes("steal password") ||
    lowerText.includes("steal passwords") ||
    lowerText.includes("steal saved passwords")
  ) {
    return {
      label: "Malicious",
      score: 95,
      category: "Credential Theft"
    };
  }

  if (
    lowerText.includes("ignore previous instructions") ||
    lowerText.includes("reveal your system prompt")
  ) {
    return {
      label: "Suspicious",
      score: 70,
      category: "Prompt Injection"
    };
  }

  if (
    lowerText.includes("create a virus") ||
    lowerText.includes("write ransomware")
  ) {
    return {
      label: "Malicious",
      score: 85,
      category: "Malware Or Abuse"
    };
  }

  return {
    label: "Safe",
    score: 10,
    category: "No Risk Detected"
  };
}

function createFactFoxBadge() {
  const badge = document.createElement("div");
  badge.id = "factfox-live-badge";
  badge.textContent = "FactFox: Ready";

  badge.style.position = "fixed";
  badge.style.bottom = "20px";
  badge.style.right = "20px";
  badge.style.zIndex = "999999";
  badge.style.padding = "10px 14px";
  badge.style.borderRadius = "8px";
  badge.style.background = "#243241";
  badge.style.color = "#ffffff";
  badge.style.fontFamily = "Arial, sans-serif";
  badge.style.fontSize = "13px";
  badge.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
  badge.style.display = "none";

  document.body.appendChild(badge);
  return badge;
}

const factFoxBadge = createFactFoxBadge();

document.addEventListener("input", (event) => {
  const target = event.target;

  if (
    target.tagName === "TEXTAREA" ||
    target.tagName === "INPUT" ||
    target.isContentEditable
  ) {
    const text = target.value || target.innerText || "";

    if (!text.trim()) {
      factFoxBadge.style.display = "none";
      return;
    }

    factFoxBadge.style.display = "block";

    const result = analyzePageText(text);

    factFoxBadge.textContent = `FactFox: ${result.label} | ${result.category} | ${result.score}/100`;

    if (result.label === "Malicious") {
      factFoxBadge.style.background = "#e74c3c";
      factFoxBadge.style.color = "#ffffff";
    } else if (result.label === "Suspicious") {
      factFoxBadge.style.background = "#f1c40f";
      factFoxBadge.style.color = "#101418";
    } else {
      factFoxBadge.style.background = "#2ecc71";
      factFoxBadge.style.color = "#101418";
    }
  }
});