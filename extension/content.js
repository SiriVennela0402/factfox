function analyzePageText(text) {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("delete all files") ||
    lowerText.includes("wipe my computer")
  ) {
    return {
      label: "Malicious",
      score: 90,
      category: "Destructive Action",
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
      score: 95,
      category: "Credential Theft",
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
      score: 70,
      category: "Prompt Injection",
    };
  }

  if (
    lowerText.includes("create a virus") ||
    lowerText.includes("write ransomware")
  ) {
    return {
      label: "Malicious",
      score: 85,
      category: "Malware Or Abuse",
    };
  }

  return {
    label: "Safe",
    score: 10,
    category: "No Risk Detected",
  };
}

function createFactFoxBadge() {
  const badge = document.createElement("div");
  badge.id = "factfox-live-badge";
  badge.textContent = "FactFox: Ready";

  badge.style.position = "fixed";
  badge.style.zIndex = "999999";
  badge.style.padding = "10px 14px";
  badge.style.borderRadius = "8px";
  badge.style.background = "#243241";
  badge.style.color = "#ffffff";
  badge.style.fontFamily = "Arial, sans-serif";
  badge.style.fontSize = "13px";
  badge.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
  badge.style.display = "none";
  badge.style.maxWidth = "360px";

  document.body.appendChild(badge);
  return badge;
}
function findEditorContainer(target) {
  let current = target;

  while (current && current !== document.body) {
    const rect = current.getBoundingClientRect();

    if (rect.width >= 300 && rect.height >= 40) {
      return current;
    }

    current = current.parentElement;
  }

  return target;
}
function positionBadgeNearTarget(badge, target) {
  const editorContainer = findEditorContainer(target);
  const targetRect = editorContainer.getBoundingClientRect();
  const badgeWidth = 360;
  const spacing = 16;

  let badgeTop = targetRect.bottom + 8;
  let badgeLeft = targetRect.left + 16;

  if (badgeLeft + badgeWidth > window.innerWidth) {
    badgeLeft = window.innerWidth - badgeWidth - spacing;
  }

  if (badgeLeft < spacing) {
    badgeLeft = spacing;
  }

  if (badgeTop < spacing) {
    badgeTop = spacing;
  }

  badge.style.top = `${badgeTop}px`;
  badge.style.left = `${badgeLeft}px`;
  badge.style.bottom = "auto";
  badge.style.right = "auto";
}

function updateBadgeColor(badge, result) {
  if (result.label === "Malicious") {
    badge.style.background = "#e74c3c";
    badge.style.color = "#ffffff";
  } else if (result.label === "Suspicious") {
    badge.style.background = "#f1c40f";
    badge.style.color = "#101418";
  } else {
    badge.style.background = "#2ecc71";
    badge.style.color = "#101418";
  }
}

function getTextFromTarget(target) {
  if (target.value) {
    return target.value;
  }

  if (target.innerText) {
    return target.innerText;
  }

  if (target.textContent) {
    return target.textContent;
  }

  const editableParent = target.closest("[contenteditable='true']");

  if (editableParent) {
    return editableParent.innerText || editableParent.textContent || "";
  }

  return "";
}

const factFoxBadge = createFactFoxBadge();

function createFactFoxSelectionButton() {
  const button = document.createElement("button");
  button.id = "factfox-selection-button";
  button.title = "Analyze with FactFox";

  button.style.position = "fixed";
  button.style.zIndex = "999999";
  button.style.display = "none";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.width = "32px";
  button.style.height = "32px";
  button.style.padding = "0";
  button.style.border = "0";
  button.style.borderRadius = "0";
  button.style.background = "transparent";
  button.style.color = "#101418";
  button.style.fontFamily = "Arial, sans-serif";
  button.style.boxShadow = "none";
  button.style.cursor = "pointer";

  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("icons/icon32.png");
  icon.alt = "";
  icon.style.width = "32px";
  icon.style.height = "32px";
  icon.style.borderRadius = "50%";
  icon.style.objectFit = "cover";

  button.appendChild(icon);
  document.body.appendChild(button);
  return button;
}

const factFoxSelectionButton = createFactFoxSelectionButton();
let lastSelectedText = "";
const FACTFOX_BACKEND_URL = "http://127.0.0.1:8000/verify";

async function verifySelectedTextWithBackend(text) {
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

function showFactFoxInlineReport(selectedText, promptSafety, verification, error) {
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
  panel.style.width = "520px";
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

  function addHeading(text) {
    const heading = document.createElement("h3");
    heading.textContent = text;
    heading.style.margin = "16px 0 8px";
    heading.style.color = "#8fbbe8";
    heading.style.fontSize = "15px";
    content.appendChild(heading);
  }

  function addText(text, color = "#d6d6d6") {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraph.style.margin = "0 0 8px";
    paragraph.style.lineHeight = "1.45";
    paragraph.style.fontSize = "13px";
    paragraph.style.color = color;
    content.appendChild(paragraph);
  }

  addHeading("Selected Text");
  addText(selectedText, "#ffffff");

  addHeading("Prompt Safety");
  addText(
    `${promptSafety.label} | ${promptSafety.category} | ${promptSafety.score}/100`,
    promptSafety.label === "Malicious" ? "#ffb4a9" : "#b7f7cc"
  );

  addHeading("Source-Based Verification");

  if (error) {
    addText(
      "Backend unavailable. Start it with: python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000",
      "#ffb4a9"
    );
  } else {
    addText(`${verification.status}: ${verification.summary}`, "#ffffff");

    for (const claim of verification.claims || []) {
      addText(`Claim: ${claim.claim}`, "#ffffff");
      addText(`Status: ${claim.status}`);

      for (const source of (claim.sources || []).slice(0, 3)) {
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
        content.appendChild(link);

        if (source.snippet) {
          addText(source.snippet, "#b8c7d9");
        }
      }
    }
  }

  panel.append(header, content);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

function getSelectedPageText() {
  const selection = window.getSelection();

  if (!selection) {
    return "";
  }

  return selection.toString().trim();
}

function positionSelectionButton() {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || !selection.toString().trim()) {
    factFoxSelectionButton.style.display = "none";
    lastSelectedText = "";
    return;
  }

  lastSelectedText = selection.toString().trim();

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (!rect || (rect.top === 0 && rect.left === 0)) {
    factFoxSelectionButton.style.display = "none";
    return;
  }

  const buttonWidth = 38;
  const spacing = 10;
  let top = rect.bottom + spacing;
  let left = rect.left;

  if (left + buttonWidth > window.innerWidth) {
    left = window.innerWidth - buttonWidth - spacing;
  }

  factFoxSelectionButton.style.top = `${Math.max(spacing, top)}px`;
  factFoxSelectionButton.style.left = `${Math.max(spacing, left)}px`;
  factFoxSelectionButton.style.display = "flex";
}

document.addEventListener("mouseup", () => {
  setTimeout(positionSelectionButton, 0);
});

document.addEventListener("keyup", () => {
  setTimeout(positionSelectionButton, 0);
});

document.addEventListener("mousedown", (event) => {
  if (!factFoxSelectionButton.contains(event.target)) {
    factFoxSelectionButton.style.display = "none";
  }
});

factFoxSelectionButton.addEventListener("mousedown", (event) => {
  event.preventDefault();
  event.stopPropagation();
});

factFoxSelectionButton.addEventListener("click", async () => {
  const selectedText = getSelectedPageText() || lastSelectedText;

  if (!selectedText) {
    factFoxSelectionButton.style.display = "none";
    return;
  }

  factFoxSelectionButton.style.display = "none";

  const promptSafety = analyzePageText(selectedText);

  try {
    const verification = await verifySelectedTextWithBackend(selectedText);
    showFactFoxInlineReport(selectedText, promptSafety, verification, null);
  } catch (error) {
    showFactFoxInlineReport(selectedText, promptSafety, null, error.message);
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  const editableParent = target.closest("[contenteditable='true']");

  if (
    target.tagName === "TEXTAREA" ||
    target.tagName === "INPUT" ||
    target.isContentEditable ||
    editableParent
  ) {
    const activeEditor = editableParent || target;
    const text = getTextFromTarget(activeEditor);

    if (!text.trim()) {
      factFoxBadge.style.display = "none";
      return;
    }

    const result = analyzePageText(text);

    factFoxBadge.textContent = `FactFox: ${result.label} | ${result.category} | ${result.score}/100`;
    factFoxBadge.style.display = "block";

    updateBadgeColor(factFoxBadge, result);
    positionBadgeNearTarget(factFoxBadge, activeEditor);
  }
});
