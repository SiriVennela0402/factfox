import streamlit as st
import pandas as pd


st.set_page_config(page_title="FactFox", page_icon="🦊", layout="centered")

st.title("FactFox")
st.caption("AI prompt safety and response verification assistant")


def classify_prompt(prompt):
    risky_words = [
        "delete all files",
        "steal",
        "password",
        "api key",
        "system prompt",
        "ignore previous instructions",
        "bypass",
        "safety rules",
    ]

    prompt_lower = prompt.lower()

    for word in risky_words:
        if word in prompt_lower:
            if word in ["delete all files", "steal", "password", "api key"]:
                return "Malicious", "High risk instruction detected."
            return "Suspicious", "Possible prompt injection or rule bypass attempt detected."

    return "Safe", "No obvious malicious instruction detected."


tab1, tab2 = st.tabs(["Prompt Risk Detector", "AI Answer Verifier"])

with tab1:
    user_prompt = st.text_area("Enter a prompt to check:")

    if st.button("Analyze Prompt"):
        if user_prompt.strip() == "":
            st.warning("Please enter a prompt first.")
        else:
            label, reason = classify_prompt(user_prompt)

            if label == "Safe":
                st.success(f"Result: {label}")
            elif label == "Suspicious":
                st.warning(f"Result: {label}")
            else:
                st.error(f"Result: {label}")

            st.write(reason)

with tab2:
    ai_answer = st.text_area("Paste an AI-generated answer:")

    if st.button("Verify Answer"):
        if ai_answer.strip() == "":
            st.warning("Please paste an answer first.")
        else:
            st.info("Verification module coming soon.")
            st.write("For now, FactFox will focus first on prompt risk detection.")