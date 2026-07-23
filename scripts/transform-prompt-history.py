#!/usr/bin/env python3
"""Transform raw prompt history into structured assessment document."""

import re
import os
from typing import Optional

SOURCE = r"c:\Users\kusha\Downloads\Untitled document.md"
OUTPUT = r"d:\projects\Quest\docs\assessment\prompt-history.md"

PHASE_ORDER = [
    "Project Planning",
    "Architecture & Documentation",
    "Backend Foundation",
    "Frontend Foundation",
    "Authentication",
    "Ticket Management",
    "Dashboard",
    "Testing",
    "Bug Fixes",
    "Docker",
    "CI/CD",
    "Documentation",
    "Final Review",
    "Submission Preparation",
]

# Chronological phase boundaries by 0-based exchange index (updated after parser fixes)
EXCHANGE_PHASE_BY_INDEX = {
    0: "Project Planning",
    1: "Backend Foundation",
    2: "Backend Foundation",
    3: "Frontend Foundation",
    4: "Frontend Foundation",
    5: "Frontend Foundation",
    6: "Frontend Foundation",
    7: "Frontend Foundation",
    8: "Frontend Foundation",
    9: "Frontend Foundation",
    10: "Bug Fixes",
    11: "Documentation",
    12: "Documentation",
    13: "Authentication",
    14: "Authentication",
    15: "Documentation",
    16: "Ticket Management",
    17: "Ticket Management",
    18: "Ticket Management",
    19: "Ticket Management",
    20: "Ticket Management",
    21: "Ticket Management",
    22: "Documentation",
    23: "Bug Fixes",
    24: "Dashboard",
    25: "Dashboard",
    26: "Bug Fixes",
    27: "Final Review",
    28: "Ticket Management",
    29: "Ticket Management",
    30: "Documentation",
    31: "Documentation",
    32: "Testing",
    33: "Testing",
    34: "Testing",
    35: "Testing",
    36: "Testing",
    37: "Docker",
    38: "Docker",
    39: "Docker",
    40: "CI/CD",
    41: "CI/CD",
    42: "CI/CD",
}


def assign_phase_by_index(index: int, prev_phase: str) -> str:
    return EXCHANGE_PHASE_BY_INDEX.get(index, prev_phase)


def preprocess_markers(raw: str) -> str:
    """Normalize prompt/response markers while preserving file order."""

    def response_replacer(match: re.Match) -> str:
        rest = (match.group(1) or "").strip()
        return f"**Response:**\n\n{rest}" if rest else "**Response:**"

    # Inline **Prompt:** with text on same line
    raw = re.sub(
        r"^\*\*Prompt:\*\*\s+(\S)",
        r"**Prompt:**\n\n\1",
        raw,
        flags=re.MULTILINE,
    )

    # Bare Prompt: line marker
    raw = re.sub(r"^Prompt:\s*$", "**Prompt:**", raw, flags=re.MULTILINE)

    # Response variants (with or without asterisks, with optional same-line content)
    raw = re.sub(
        r"^\*\*Response\s*:\s*\*?\*?\s*(.*)$",
        response_replacer,
        raw,
        flags=re.MULTILINE,
    )
    raw = re.sub(
        r"^Response:\s*(.*)$",
        response_replacer,
        raw,
        flags=re.MULTILINE,
    )
    raw = re.sub(r"^Response\s*$", "**Response:**", raw, flags=re.MULTILINE)

    # Unmarked prompts present in source export
    raw = re.sub(
        r"(?<=\n\n)(Implement the Docker setup according to the approved plan\.)",
        r"**Prompt:**\n\n\1",
        raw,
    )

    return raw


def clean_markdown(text: str) -> str:
    if not text:
        return text

    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        line = re.sub(r"\\([#*_`\[\](){}.!+\-|=<>~])", r"\1", line)
        line = re.sub(r"^(\s*)(\d+)\\\.\s", r"\1\2. ", line)
        line = re.sub(r"^(\s*)\\-\s", r"\1- ", line)
        line = line.replace("\\_", "_")
        line = line.replace("\\>", ">")
        line = line.replace("\\|", "|")
        cleaned_lines.append(line)

    text = "\n".join(cleaned_lines)
    text = re.sub(r"\n{4,}", "\n\n\n", text)

    lines = text.split("\n")
    if len(lines) > 20:
        non_empty = sum(1 for l in lines if l.strip())
        blank = len(lines) - non_empty
        if blank > non_empty * 0.4:
            new_lines = []
            i = 0
            while i < len(lines):
                new_lines.append(lines[i])
                if (
                    i + 1 < len(lines)
                    and lines[i].strip()
                    and not lines[i + 1].strip()
                    and i + 2 < len(lines)
                    and lines[i + 2].strip()
                ):
                    i += 2
                    continue
                i += 1
            text = "\n".join(new_lines)

    return text.strip()


def is_marker_line(line: str) -> Optional[str]:
    s = line.strip()
    if re.match(r"^\*\*Prompt:\*\*\s*$", s):
        return "prompt"
    if re.match(r"^\*\*Response:\*\*\s*$", s):
        return "response"
    return None


def looks_like_mislabeled_response(content: str) -> bool:
    """Only truly mislabeled AI summaries — not user refinement prompts."""
    starters = (
        "All done.",
        "All done ",
        "Reporter filter done.",
        "Swagger/OpenAPI implemented",
        "## Backend Foundation",
        "Milestone 3 Phase 1 backend done",
        "Milestone 2 frontend authentication is implemented",
        "Frontend Foundation done",
        "Documentation gaps addressed",
        "`actionlint` isn't distributable",
    )
    return content.lstrip().startswith(starters)


def is_duplicate_response(a: str, b: str) -> bool:
    if not a or not b:
        return False
    na = re.sub(r"\s+", " ", a[:500])
    nb = re.sub(r"\s+", " ", b[:500])
    return na == nb


def parse_exchanges(raw: str) -> list[dict]:
    raw = preprocess_markers(raw)
    lines = raw.split("\n")
    segments = []
    current_kind = None
    current_content: list[str] = []

    def flush():
        nonlocal current_kind, current_content
        if current_kind and current_content:
            content = "\n".join(current_content).strip()
            if content:
                segments.append({"kind": current_kind, "content": content})
        current_content = []

    for line in lines:
        marker = is_marker_line(line)
        if marker:
            flush()
            current_kind = marker
        else:
            if current_kind:
                current_content.append(line)
    flush()

    for seg in segments:
        if seg["kind"] == "prompt" and looks_like_mislabeled_response(seg["content"]):
            seg["kind"] = "response"
            seg["mislabeled"] = True

    exchanges = []
    pending_prompt = None

    for seg in segments:
        if seg["kind"] == "prompt":
            if pending_prompt:
                exchanges.append({"prompt": pending_prompt, "response": None})
            pending_prompt = seg
        else:
            note = "Originally mislabeled as Prompt in source document." if seg.get("mislabeled") else None
            if pending_prompt:
                exchanges.append({"prompt": pending_prompt, "response": seg, "note": note})
                pending_prompt = None
            else:
                exchanges.append({"prompt": None, "response": seg, "note": note})
    if pending_prompt:
        exchanges.append({"prompt": pending_prompt, "response": None})

    deduped = []
    prev_response = None
    for ex in exchanges:
        resp_content = ex["response"]["content"] if ex["response"] else None
        if resp_content and prev_response and is_duplicate_response(resp_content, prev_response):
            if not ex["prompt"]:
                continue
        deduped.append(ex)
        prev_response = resp_content

    return deduped


def has_approval_adjustments(prompt: str) -> bool:
    return bool(prompt and re.search(r"approved with the following adjustments", prompt, re.I))


def format_exchange(num: int, exchange: dict) -> str:
    parts = [f"### Exchange {num}\n"]

    if exchange.get("note"):
        parts.append(f"> **Note:** {exchange['note']}\n")

    prompt = exchange.get("prompt")
    response = exchange.get("response")

    if prompt:
        content = clean_markdown(prompt["content"])
        parts.append("#### User Prompt\n")
        parts.append(content)
        parts.append("\n")

        if has_approval_adjustments(content):
            parts.append(
                "#### Decision\n\n"
                "**User feedback:** Approved with specified adjustments before implementation.\n\n"
                "**Final decision:** Proceed per adjusted requirements in prompt above.\n\n"
            )
    elif response:
        parts.append("> **Note:** No explicit user prompt in source export for this exchange.\n\n")

    if response:
        content = clean_markdown(response["content"])
        parts.append("#### AI Response\n")
        parts.append(content)
        parts.append("\n")

    parts.append("\n---\n")
    return "\n".join(parts)


def build_toc(phases: dict) -> str:
    lines = ["## Table of Contents\n"]
    for phase in PHASE_ORDER:
        if phase not in phases or not phases[phase]:
            continue
        anchor = phase.lower().replace(" ", "-").replace("&", "").replace("/", "")
        anchor = re.sub(r"[^a-z0-9-]", "", anchor)
        count = len(phases[phase])
        lines.append(f"- [{phase}](#{anchor}) ({count} exchange{'s' if count != 1 else ''})")
    lines.append("")
    return "\n".join(lines)


def build_timeline() -> str:
    lines = ["## Project Timeline\n"]
    items = [
        ("Phase 1", "Planning"),
        ("Phase 2", "Architecture & Documentation"),
        ("Phase 3", "Backend Foundation"),
        ("Phase 4", "Frontend Foundation"),
        ("Phase 5", "Authentication"),
        ("Phase 6", "Ticket Management"),
        ("Phase 7", "Dashboard"),
        ("Phase 8", "Testing"),
        ("Phase 9", "Bug Fixes"),
        ("Phase 10", "Docker & CI"),
        ("Phase 11", "Documentation"),
        ("Phase 12", "Final Review"),
        ("Phase 13", "Submission Preparation"),
    ]
    for phase, name in items:
        lines.append(f"- {phase} — {name}")
    lines.append("")
    return "\n".join(lines)


def main():
    with open(SOURCE, "r", encoding="utf-8") as f:
        raw = f.read()

    exchanges = parse_exchanges(raw)
    print(f"Parsed {len(exchanges)} exchanges")

    phases: dict[str, list] = {p: [] for p in PHASE_ORDER}
    current_phase = "Project Planning"
    for i, ex in enumerate(exchanges):
        current_phase = assign_phase_by_index(i, current_phase)
        phases[current_phase].append(ex)

    print("Phase distribution:")
    for phase in PHASE_ORDER:
        if phases[phase]:
            print(f"  {phase}: {len(phases[phase])}")

    if len(exchanges) != len(EXCHANGE_PHASE_BY_INDEX):
        print(f"WARNING: {len(exchanges)} exchanges parsed, {len(EXCHANGE_PHASE_BY_INDEX)} phase mappings defined")
        for i, ex in enumerate(exchanges):
            if i not in EXCHANGE_PHASE_BY_INDEX:
                p = ex["prompt"]["content"][:70] if ex["prompt"] else "(no prompt)"
                print(f"  unmapped {i}: {p}")

    out = []
    out.append("# Prompt History\n")
    out.append(
        "> Chronological record of AI-assisted development for the Quest project "
        "(JS AI Capability Exercise).\n"
    )
    out.append(
        "> This document preserves implementation decisions, user feedback, debugging sessions, "
        "and verification steps.\n"
    )
    out.append(build_timeline())
    out.append(build_toc(phases))
    out.append("---\n")
    out.append("## Chronological Record\n")
    out.append(
        "> Exchanges are in original chronological order. Phase headings mark when the "
        "engineering focus shifts.\n"
    )

    current_phase = None
    for i, ex in enumerate(exchanges):
        phase = assign_phase_by_index(i, current_phase or "Project Planning")
        if phase != current_phase:
            current_phase = phase
            out.append(f"\n## {current_phase}\n")
            if phase == "Project Planning":
                out.append(
                    "*Architecture and documentation alignment (DBML paths, UI assets, "
                    "health API spec) is recorded in Exchange 1.*\n"
                )
        out.append(format_exchange(i + 1, ex))

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write("\n".join(out))

    size = os.path.getsize(OUTPUT)
    print(f"Written {OUTPUT} ({size:,} bytes, {len(exchanges)} exchanges)")


if __name__ == "__main__":
    main()
