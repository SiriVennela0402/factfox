const FACTFOX_BACKEND_URL = "http://127.0.0.1:8000/verify";

function createFactFoxMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "analyzeWithFactFox",
      title: "Analyze with FactFox",
      contexts: ["selection"],
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
      reason:
        "The selected text contains an instruction that could damage files or systems.",
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
      reason:
        "The selected text appears to request access to private credentials.",
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
      reason: "The selected text attempts to override or bypass AI instructions.",
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
      reason: "The selected text requests harmful software or cyber abuse.",
    };
  }

  return {
    label: "Safe",
    category: "No Prompt Risk Detected",
    score: 10,
    reason: "No obvious malicious prompt pattern was detected.",
  };
}

async function verifyWithBackend(text) {
  const response = await fetch(FACTFOX_BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.json();
}

function showFactFoxReport(selectedText, promptSafety, verification, backendError) {
  const oldPanel = document.getElementById("factfox-report-overlay");

  if (oldPanel) {
    oldPanel.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "factfox-report-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "2147483647";
  overlay.style.background = "rgba(0, 0, 0, 0.48)";
  overlay.style.fontFamily = "Arial, sans-serif";

  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.top = "32px";
  panel.style.right = "32px";
  panel.style.width = "420px";
  panel.style.maxWidth = "calc(100vw - 32px)";
  panel.style.maxHeight = "calc(100vh - 64px)";
  panel.style.overflow = "auto";
  panel.style.background = "#101418";
  panel.style.color = "#f5f5f5";
  panel.style.border = "1px solid #26313d";
  panel.style.borderRadius = "10px";
  panel.style.boxShadow = "0 18px 50px rgba(0, 0, 0, 0.45)";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";
  header.style.gap = "12px";
  header.style.padding = "16px";
  header.style.borderBottom = "1px solid #26313d";

  const title = document.createElement("h2");
  title.textContent = "FactFox Report";
  title.style.margin = "0";
  title.style.color = "#ff7a1a";
  title.style.fontSize = "20px";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.border = "0";
  closeButton.style.borderRadius = "6px";
  closeButton.style.padding = "8px 10px";
  closeButton.style.background = "#243241";
  closeButton.style.color = "#f5f5f5";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => overlay.remove());

  header.append(title, closeButton);

  const content = document.createElement("div");
  content.style.padding = "16px";

  function addSection(sectionTitle) {
    const section = document.createElement("section");
    section.style.marginBottom = "16px";

    const heading = document.createElement("h3");
    heading.textContent = sectionTitle;
    heading.style.margin = "0 0 8px";
    heading.style.color = "#8fbbe8";
    heading.style.fontSize = "15px";

    section.appendChild(heading);
    content.appendChild(section);
    return section;
  }

  function addText(parent, text, options = {}) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraph.style.margin = options.margin || "0 0 8px";
    paragraph.style.lineHeight = "1.45";
    paragraph.style.fontSize = options.fontSize || "13px";
    paragraph.style.color = options.color || "#d6d6d6";
    parent.appendChild(paragraph);
    return paragraph;
  }

  const selectedSection = addSection("Selected Text");
  addText(selectedSection, selectedText);

  const promptSection = addSection("Prompt Safety");
  const promptBadge = document.createElement("div");
  promptBadge.textContent = `${promptSafety.label} | ${promptSafety.category} | ${promptSafety.score}/100`;
  promptBadge.style.display = "inline-block";
  promptBadge.style.margin = "0 0 8px";
  promptBadge.style.padding = "6px 8px";
  promptBadge.style.borderRadius = "999px";
  promptBadge.style.fontSize = "12px";
  promptBadge.style.fontWeight = "700";
  promptBadge.style.background =
    promptSafety.label === "Malicious"
      ? "#e74c3c"
      : promptSafety.label === "Suspicious"
        ? "#f1c40f"
        : "#2ecc71";
  promptBadge.style.color =
    promptSafety.label === "Malicious" ? "#ffffff" : "#101418";
  promptSection.appendChild(promptBadge);
  addText(promptSection, promptSafety.reason);

  const verificationSection = addSection("Source-Based Verification");

  if (backendError) {
    addText(
      verificationSection,
      "Backend unavailable. Start the local backend with: python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000",
      { color: "#ffb4a9" }
    );
  } else {
    addText(verificationSection, `${verification.status}: ${verification.summary}`);

    if (!verification.claims || verification.claims.length === 0) {
      addText(verificationSection, "No source-heavy claim markers were detected.");
    }

    for (const claimItem of verification.claims || []) {
      const claimCard = document.createElement("div");
      claimCard.style.margin = "12px 0";
      claimCard.style.padding = "12px";
      claimCard.style.border = "1px solid #26313d";
      claimCard.style.borderRadius = "8px";
      claimCard.style.background = "#171d24";

      addText(claimCard, claimItem.claim, {
        color: "#ffffff",
        fontSize: "13px",
      });
      addText(claimCard, `Status: ${claimItem.status}`);
      addText(claimCard, `Types: ${(claimItem.types || []).join(", ")}`);
      addText(claimCard, claimItem.confidence || "");

      for (const source of (claimItem.sources || []).slice(0, 3)) {
        const link = document.createElement("a");
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = source.name || source.url;
        link.style.display = "block";
        link.style.margin = "10px 0 4px";
        link.style.color = "#8fbbe8";
        link.style.fontSize = "13px";
        link.style.textDecoration = "none";
        claimCard.appendChild(link);

        if (source.snippet) {
          addText(claimCard, source.snippet, {
            color: "#b8c7d9",
            fontSize: "12px",
          });
        }
      }

      verificationSection.appendChild(claimCard);
    }
  }

  panel.append(header, content);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

chrome.runtime.onInstalled.addListener(() => {
  createFactFoxMenu();
});

chrome.runtime.onStartup.addListener(() => {
  createFactFoxMenu();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "analyzeWithFactFox" && info.selectionText) {
    const selectedText = info.selectionText;
    const promptSafety = analyzePromptSafety(selectedText);
    let verification = null;
    let backendError = null;

    try {
      verification = await verifyWithBackend(selectedText);
    } catch (error) {
      backendError = error.message;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showFactFoxReport,
      args: [selectedText, promptSafety, verification, backendError],
    });
  }
});
