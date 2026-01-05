FROM python:3.9-slim

WORKDIR /main

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Dono ports expose karein
EXPOSE 7860
EXPOSE 8001

# Optional: Multiple ports allow karne ke liye
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}"]


