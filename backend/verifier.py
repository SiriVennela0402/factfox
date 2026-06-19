import os
import re
from urllib.parse import quote_plus

from dotenv import load_dotenv
from tavily import TavilyClient

from .claim_extractor import extract_claims


load_dotenv()
MAX_SNIPPET_LENGTH = 320


def shorten_snippet(snippet: str | None) -> str:
    if not snippet:
        return "No snippet available."

    cleaned_snippet = " ".join(snippet.split())
    cleaned_snippet = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", cleaned_snippet)
    cleaned_snippet = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned_snippet)
    cleaned_snippet = re.sub(r"[*_`#]+", "", cleaned_snippet)
    cleaned_snippet = " ".join(cleaned_snippet.split())

    if len(cleaned_snippet) <= MAX_SNIPPET_LENGTH:
        return cleaned_snippet

    return f"{cleaned_snippet[:MAX_SNIPPET_LENGTH].rstrip()}..."


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


def search_external_sources(claim: str) -> list[dict]:
    api_key = os.getenv("TAVILY_API_KEY")

    if not api_key:
        return build_source_links(claim)

    try:
        tavily_client = TavilyClient(api_key=api_key)
        response = tavily_client.search(
            query=claim,
            search_depth="basic",
            max_results=5,
            include_answer=False,
        )
    except Exception:
        return build_source_links(claim)

    results = response.get("results", [])

    if not results:
        return build_source_links(claim)

    sources = []

    for result in results:
        sources.append(
            {
                "name": result.get("title") or "External Source",
                "url": result.get("url"),
                "snippet": shorten_snippet(result.get("content")),
                "score": result.get("score"),
                "provider": "Tavily",
            }
        )

    return sources


def classify_claim_status(sources: list[dict]) -> tuple[str, str]:
    source_count = len([source for source in sources if source.get("url")])

    if source_count >= 3:
        return (
            "Source Evidence Found",
            "Multiple external sources were found. Review the snippets and links before trusting the claim.",
        )

    if source_count >= 1:
        return (
            "Limited Source Evidence",
            "Some external evidence was found, but the claim may need more source checking.",
        )

    return (
        "Needs Source Check",
        "No external source result was found automatically. Manual verification is recommended.",
    )


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
        sources = search_external_sources(item["claim"])
        status, confidence = classify_claim_status(sources)

        verified_claims.append(
            {
                "claim": item["claim"],
                "types": item["types"],
                "status": status,
                "confidence": confidence,
                "sources": sources,
            }
        )

    return {
        "status": "Needs Verification",
        "summary": f"Found {len(verified_claims)} claim(s) that should be checked against external sources.",
        "claims": verified_claims,
    }
