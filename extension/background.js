function createFactFoxMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "analyzeWithFactFox",
      title: "Analyze with FactFox",
      contexts: ["selection"]
    });
  });
}

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

chrome.runtime.onInstalled.addListener(() => {
  createFactFoxMenu();
});

chrome.runtime.onStartup.addListener(() => {
  createFactFoxMenu();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeWithFactFox" && info.selectionText) {
    const result = analyzeSelectedText(info.selectionText);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectedText, scanResult) => {
        alert(`FactFox selected text scan:\n\n${selectedText}\n\nResult:\n${scanResult}`);
      },
      args: [info.selectionText, result]
    });
  }
});