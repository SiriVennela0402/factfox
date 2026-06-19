# FactFox

FactFox is a browser-based AI safety assistant that detects risky prompts and helps verify AI-generated answers with external source evidence.

## Features
- Chrome browser extension popup for scanning prompts and AI-generated text
- Risk scoring from 0-100
- Safe, Suspicious, and Malicious classification
- Detection categories:
  - Prompt Injection
  - Credential Theft
  - API Key Leakage
  - Destructive Action
  - Data Exfiltration
  - Malware Or Abuse
  - Unsafe Automation
- Clear explanation for each detected risk
- Streamlit prototype included for early testing
- Right-click selected text scanning on webpages
- Live textbox scanning with a floating FactFox safety badge
- Grammarly-style floating safety badge near supported text editors
- Improved support for AI-style prompt editors such as Gemini
- Source-backed selected text verification through the local FastAPI backend
- External source retrieval using Tavily
- Floating FactFox icon for selected text analysis without opening the context menu

## Browser Extension Setup

1. Open Chrome and go to `chrome://extensions`.
2. Turn on Developer mode.
3. Click `Load unpacked`.
4. Select the `extension` folder from this project.
5. Click the FactFox icon and paste a prompt or AI-generated answer to scan.
6. Highlight text on a webpage, right-click, and choose `Analyze with FactFox`.
7. Highlight text and click the floating FactFox icon to open the same report.
8. Type inside a webpage text box to see the live FactFox safety badge.
9. Open an AI chat page such as Gemini and type in the prompt box to see FactFox scan the prompt live.
10. Start the backend before using source-backed selected text verification.

## Backend Verification API

Run the local verification backend with:

```powershell
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

The backend extracts factual claims and uses Tavily to retrieve external source evidence. It returns detected claim markers, source titles, URLs, snippets, and evidence status.

For external source retrieval, create a local `.env` file and add:

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

The `.env` file is ignored by Git and should not be pushed to GitHub.

## How It Works

```text
Browser Extension
  -> live prompt safety scanning
  -> right-click selected text analysis
  -> local FastAPI backend
  -> claim extraction
  -> Tavily external source search
  -> FactFox report panel with source evidence
```

## Demo Workflow

1. Start the backend.
2. Load the extension in Chrome.
3. Type a risky prompt in Gemini to see the live safety badge.
4. Highlight an AI answer or factual claim.
5. Click the floating FactFox icon or right-click and choose `Analyze with FactFox`.
6. Review prompt safety, claim markers, and external source evidence.

## Reveal Materials

Final demo notes, resume bullets, and a LinkedIn reveal draft are available in:

```text
docs/REVEAL_PACKAGE.md
```

## Tech Stack

- Python
- Streamlit
- Pandas
- Scikit-learn
- FastAPI
- Uvicorn
- Tavily
- JavaScript
- Chrome Extensions

## Project Goal

This project is designed as an AI/Data Science portfolio project focused on AI safety, prompt security, and trustworthy AI systems.

## Current Limitations

- FactFox provides source evidence, not a perfect final truth judgment.
- The backend must be running locally for source-backed verification.
- Live prompt scanning support can vary across websites depending on how their editors are built.

## Future Improvements

- Add automatic claim-level supported/unsupported classification.
- Add more trusted-source filters.
- Add a persistent report history.
- Package the extension for Chrome Web Store submission.
