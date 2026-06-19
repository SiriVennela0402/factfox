# FactFox

FactFox is an AI safety project that detects risky or malicious prompts and helps verify whether AI-generated answers are reliable.

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

## Browser Extension Setup

1. Open Chrome and go to `chrome://extensions`.
2. Turn on Developer mode.
3. Click `Load unpacked`.
4. Select the `extension` folder from this project.
5. Click the FactFox icon and paste a prompt or AI-generated answer to scan.
6. Highlight text on a webpage, right-click, and choose `Analyze with FactFox`.
7. Type inside a webpage text box to see the live FactFox safety badge.
8. Open an AI chat page such as Gemini and type in the prompt box to see FactFox scan the prompt live.
9. Start the backend before using source-backed selected text verification.

## Backend Verification API

Run the local verification backend with:

```powershell
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

The backend extracts factual claims and uses Tavily to retrieve external source evidence.

For external source retrieval, create a local `.env` file and add:

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

The `.env` file is ignored by Git and should not be pushed to GitHub.

## Tech Stack

- Python
- Streamlit
- Pandas
- Scikit-learn
- FastAPI
- Uvicorn

## Project Goal

This project is designed as an AI/Data Science portfolio project focused on AI safety, prompt security, and trustworthy AI systems.
