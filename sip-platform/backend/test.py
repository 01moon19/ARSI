from dotenv import load_dotenv
import os
from pathlib import Path

# force exact path
env_path = Path(__file__).parent / ".env"

print("Loading .env from:", env_path)

load_dotenv(dotenv_path=env_path, override=True)

print("KEY:", os.getenv("GOOGLE_API_KEY"))