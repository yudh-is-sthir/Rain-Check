# 🌦️ Rain-Check Enterprise
> A distributed, cloud-native weather monitoring system built to demonstrate Full-Stack to DevOps evolution.

## 🚀 Project Overview
Rain-Check began as a simple monolith and was refactored into a scalable microservices architecture. It demonstrates modern engineering practices including containerization, orchestration, and async background processing.

### 🏗️ Architecture (v2.0)
The system is composed of **4 decoupled microservices**:
1.  **Gateway (Nginx):** Reverse proxy handling routing and static frontend serving.
2.  **Auth Service (Node.js):** Manages user identity and session issuance.
3.  **Weather Service (Node.js):** Handles real-time weather data and batch ingestion.
4.  **Worker Service (Node.js):** Background worker processing heavy batch jobs via Queue.

**Infrastructure:**
*   **Orchestration:** Kubernetes (K8s) & Docker Compose
*   **Data:** Redis (Distributed Sessions & BullMQ Job Queue) + SQLite (User Data)
*   **Security:** Air-gapped backend services (only Gateway is public)

---

## 🛠️ How to Run

### Option A: The "Cloud Native" Way (Kubernetes)
*Prerequisite: Docker Desktop with Kubernetes enabled.*

1.  **Build Images:**
    ```bash
    docker build -t rain-check-auth:latest -f services/auth-service/Dockerfile services/auth-service/
    docker build -t rain-check-weather:latest -f services/weather-service/Dockerfile services/weather-service/
    docker build -t rain-check-worker:latest -f services/worker-service/Dockerfile services/worker-service/
    docker build -t rain-check-gateway:latest -f services/gateway/Dockerfile .
    ```

2.  **Deploy:**
    ```bash
    kubectl apply -f k8s/
    ```

3.  **Access:**
    Open `http://localhost` (Port 80).

### Option B: The "DevOps" Way (Docker Compose)
*Best for local development.*

```bash
docker-compose up --build
```
Access at `http://localhost:3000`.

### Option C: The "Legacy" Way (Monolith v1)
*The original simple version.*

```bash
cd server
npm install
npm start
```
Access at `http://localhost:3000`.

---

## 🧪 Features
*   **Secure Authentication:** Session-based auth backed by Redis.
*   **Real-time Weather:** Fetches data from OpenWeatherMap.
*   **Batch Processing (Pro):** Submit a list of 100+ cities; processed asynchronously by background workers.
*   **Resilience:** Self-healing pods via Kubernetes.

---

## 📂 Project Structure
```
├── k8s/                  # Kubernetes Manifests (Deployments, Services, Secrets)
├── services/             # Microservices Source Code
│   ├── auth-service/     # Login & DB Logic
│   ├── weather-service/  # API & Queue Producer
│   ├── worker-service/   # Queue Consumer (BullMQ)
│   └── gateway/          # Nginx Config
├── public/               # Frontend Assets (Glassmorphism UI)
├── server/               # [LEGACY] V1 Monolithic Server
└── docker-compose.yml    # Local Orchestration
```

## License
MIT
