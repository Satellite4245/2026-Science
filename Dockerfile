# 1단계: 프론트엔드 빌드 (Node.js)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2단계: 백엔드 & 통합 실행 환경 (Python)
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 백엔드 코드 복사
COPY main.py ./

# 빌드된 프론트엔드 정적 파일 복사
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

