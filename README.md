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

## Browser Extension Setup

1. Open Chrome and go to `chrome://extensions`.
2. Turn on Developer mode.
3. Click `Load unpacked`.
4. Select the `extension` folder from this project.
5. Click the FactFox icon and paste a prompt or AI-generated answer to scan.

## Tech Stack

- Python
- Streamlit
- Pandas
- Scikit-learn

## Project Goal

This project is designed as an AI/Data Science portfolio project focused on AI safety, prompt security, and trustworthy AI systems.