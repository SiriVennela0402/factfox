from urllib.parse import quote_plus

from .claim_extractor import extract_claims


def build_source_links(claim: str) -> list[dict]:
    query = quote_plus(claim)

    return [
        {
            "name": "Google Search",
            "url": f"https://www.google.com/search?q={query}",
        },
        {
            "name": "Google Scholar",
            "url": f"https://scholar.google.com/scholar?q={query}",
        },
        {
            "name": "Wikipedia Search",
            "url": f"https://en.wikipedia.org/w/index.php?search={query}",
        },
    ]


def verify_text(text: str) -> dict:
    claims = extract_claims(text)

    if not claims:
        return {
            "status": "Low Verification Need",
            "summary": "No obvious factual claim markers were detected.",
            "claims": [],
        }

    verified_claims = []

    for item in claims:
        verified_claims.append(
            {
                "claim": item["claim"],
                "types": item["types"],
                "status": "Needs Source Check",
                "confidence": "Pending external search",
                "sources": build_source_links(item["claim"]),
            }
        )

    return {
        "status": "Needs Verification",
        "summary": f"Found {len(verified_claims)} claim(s) that should be checked against external sources.",
        "claims": verified_claims,
    }
