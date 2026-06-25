from pathlib import Path
from tempfile import NamedTemporaryFile
from zipfile import ZIP_DEFLATED, ZipFile


workbook_path = (
    Path(__file__).resolve().parents[1]
    / "public"
    / "materials"
    / "fiek"
    / "viti1"
    / "Fizik1"
    / "Raport.xlsx"
)

with ZipFile(workbook_path, "r") as source:
    with NamedTemporaryFile(
        dir=workbook_path.parent,
        prefix="raport-",
        suffix=".xlsx",
        delete=False,
    ) as temporary:
        temporary_path = Path(temporary.name)

    with ZipFile(temporary_path, "w", ZIP_DEFLATED) as target:
        for entry in source.infolist():
            data = source.read(entry.filename)
            if entry.filename == "docProps/core.xml":
                text = data.decode("utf-8")
                text = text.replace(
                    "<dc:creator>Arion</dc:creator>",
                    "<dc:creator>FIEK Hub</dc:creator>",
                )
                text = text.replace(
                    "<cp:lastModifiedBy>Arion Ukshini</cp:lastModifiedBy>",
                    "<cp:lastModifiedBy>FIEK Hub</cp:lastModifiedBy>",
                )
                data = text.encode("utf-8")
            target.writestr(entry, data)

temporary_path.replace(workbook_path)
print(f"Scrubbed personal metadata from {workbook_path.name}")
