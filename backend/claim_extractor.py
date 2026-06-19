import re


def split_sentences(text: str) -> list[str]:
    cleaned_text = " ".join(text.split())
    if not cleaned_text:
        return []

    return [
        sentence.strip()
        for sentence in re.split(r"(?<=[.!?])\s+", cleaned_text)
        if sentence.strip()
    ]


def extract_claims(text: str) -> list[dict]:
    claims = []

    for sentence in split_sentences(text):
        claim_types = []

        if re.search(r"\b(19|20)\d{2}\b", sentence):
            claim_types.append("date_or_year")

        if re.search(r"\b\d+(\.\d+)?%", sentence):
            claim_types.append("percentage_or_statistic")

        if re.search(r"\b\d{2,}\b", sentence):
            claim_types.append("number_or_quantity")

        if re.search(r"[$₹€£]", sentence):
            claim_types.append("money_claim")

        lower_sentence = sentence.lower()

        if any(
            word in lower_sentence
            for word in ["always", "never", "guaranteed", "proven", "100%"]
        ):
            claim_types.append("strong_claim")

        if any(
            word in lower_sentence
            for word in ["medical", "medicine", "legal", "financial", "investment"]
        ):
            claim_types.append("high_stakes_claim")

        if claim_types:
            claims.append(
                {
                    "claim": sentence,
                    "types": claim_types,
                }
            )

    return claims
