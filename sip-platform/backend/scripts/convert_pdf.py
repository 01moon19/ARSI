import fitz  # pymupdf
import os

from app.core.config import settings

RAW_FOLDER = settings.RAW_STORAGE_PATH
PROCESSED_FOLDER = settings.PROCESSED_STORAGE_PATH

def convert_pdf_to_text(pdf_path, output_path):
    doc = fitz.open(pdf_path)

    full_text = ""

    for i, page in enumerate(doc):
        try:
            text = page.get_text("text")
            if text.strip():
                full_text += text + "\n"
            else:
                print(f"⚠️ Empty page {i} in {pdf_path}")
        except Exception as e:
            print(f"⚠️ Skipping page {i} in {pdf_path}: {e}")

    # Save output
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"✅ Saved: {output_path}")


def process_all_pdfs():
    if not os.path.exists(PROCESSED_FOLDER):
        os.makedirs(PROCESSED_FOLDER)

    for file_name in os.listdir(RAW_FOLDER):
        if file_name.lower().endswith(".pdf"):
            pdf_path = os.path.join(RAW_FOLDER, file_name)

            # Create corresponding txt filename
            txt_name = os.path.splitext(file_name)[0] + ".txt"
            output_path = os.path.join(PROCESSED_FOLDER, txt_name)

            print(f"\n📄 Processing: {file_name}")
            convert_pdf_to_text(pdf_path, output_path)


if __name__ == "__main__":
    process_all_pdfs()