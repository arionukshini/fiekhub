import json
from pathlib import Path

from docx import Document
from docx.oxml.ns import qn


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = PROJECT_ROOT / "public" / "materials" / "fiek" / "viti1" / "Fizik1"
OUTPUT_PATH = SOURCE_ROOT / "temat-e-testeve.json"

DOCUMENTS = [
    {
        "id": "testi-i-pare",
        "title": "Temat për testin e parë",
        "file": "Temat nga Fizika per inxhinieri 1 per testin e pare.docx",
    },
    {
        "id": "testi-i-dyte",
        "title": "Temat për testin e dytë",
        "file": "Temat nga Fizika per inxhinieri 1 per testin e dyte.docx",
    },
]


def normalize_color(value):
    if not value:
        return "black"

    value = value.upper()
    red = int(value[0:2], 16)
    green = int(value[2:4], 16)
    blue = int(value[4:6], 16)

    if red > green * 1.35 and red > blue * 1.35:
        return "red"
    if green > red * 1.2 and green > blue * 1.1:
        return "green"
    return "black"


def run_color(run):
    color = run.font.color
    if color and color.rgb:
        return normalize_color(str(color.rgb))

    run_properties = run._element.rPr
    if run_properties is not None:
        color_element = run_properties.find(qn("w:color"))
        if color_element is not None:
            value = color_element.get(qn("w:val"))
            if value and value.lower() != "auto":
                return normalize_color(value)

    return "black"


def merge_runs(runs):
    merged = []
    for run in runs:
        text = run.text
        if not text:
            continue

        color = run_color(run)
        if merged and merged[-1]["color"] == color:
            merged[-1]["text"] += text
        else:
            merged.append({"text": text, "color": color})
    return merged


def extract_document(document_config):
    path = SOURCE_ROOT / document_config["file"]
    document = Document(path)
    paragraphs = []

    for paragraph in document.paragraphs:
        runs = merge_runs(paragraph.runs)
        if not runs or not "".join(run["text"] for run in runs).strip():
            continue

        paragraphs.append(
            {
                "style": paragraph.style.name if paragraph.style else "Normal",
                "runs": runs,
            }
        )

    return {
        **document_config,
        "paragraphs": paragraphs,
    }


payload = {
    "legend": [
        {
            "color": "red",
            "text": "Me ngjyrë të kuqe janë temat nga të cilat jeni të liruar edhe në test, edhe në provim.",
        },
        {
            "color": "green",
            "text": "Me ngjyrë të gjelbër janë temat nga të cilat jeni të liruar në test, por jo në provim.",
        },
        {
            "color": "black",
            "text": "Me të zezë janë temat që i keni edhe në test, edhe në provim.",
        },
    ],
    "documents": [extract_document(config) for config in DOCUMENTS],
}

OUTPUT_PATH.write_text(
    json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(f"Generated {OUTPUT_PATH.relative_to(PROJECT_ROOT)}")
