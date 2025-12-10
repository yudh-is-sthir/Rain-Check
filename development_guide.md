# Rain-Check: End-to-End Development Guide

## Project Goals
This guide tracks the evolution of "Rain-Check" from a simple MVP to a scalable distributed system.
- **Goal 1:** Learn full-stack basics (Completed in v1.0.0).
- **Goal 2:** Learn DevOps, Containerization, and Microservices (Upcoming in v2.0.0).

---

# PART 1: THE MVP (v1.0.0) - Monolith
*Completed successfully.*

## Phase 1: Planning & Design
- **Architecture:** Monolith (Express.js)
- **Database:** SQLite
- **Deployment:** Render.com
- **Auth:** Session-based (In-Memory)

## Phase 2: Environment Setup
- ✅ Node.js Installation
- ✅ Project Initialization
- ✅ Dependency Management (npm)

## Phase 3: Development
- ✅ Backend: Express Server, Auth Routes, Weather API
- ✅ Frontend: Login Page, Dashboard, Glassmorphism CSS

## Phase 4: Testing
- ✅ Manual Verification
- ✅ Error Handling Check

## Phase 5: Deployment
- ✅ Config: `render.yaml`
- ✅ Cloud: Render.com Web Service
- ✅ Status: User can log in and check weather on live URL.

---

# PART 2: THE SCALE-UP (v2.0.0) - Microservices & DevOps
*We are here now. The goal is challenging engineering.*

## Phase 7: Containerization (DevOps Foundation)
**Objective:** Eliminate "it works on my machine" and prepare for K8s.
- [ ] **Docker Engine:** Verify installation (`docker --version`).
- [ ] **Dockerfile:** Write multi-stage build script for Node.js app.
- [ ] **.dockerignore:** Optimize build context.
- [ ] **Redis:** Replace MemoryStore with Redis container for distributed sessions.
- [ ] **Docker Compose:** Orchestrate App + Redis + DB locally.
- [ ] **Verification:** App must work identically inside container.

## Phase 8: Microservices Refactor (Architecture)
**Objective:** Decouple logic to allow independent scaling.
- [ ] **Service Split:**
    - `auth-service` (Port 3001): User management & JWTs.
    - `weather-service` (Port 3002): External API calls & caching.
- [ ] **Communication:** Replace direct function calls with REST HTTP or RabbitMQ.
- [ ] **Gateway:** Implement Nginx Reverse Proxy to route `/api/auth` -> Auth Service and `/api/weather` -> Weather Service.

## Phase 9: Orchestration (Kubernetes)
**Objective:** Manage deployment, failover, and scaling like a pro.
- [ ] **Cluster:** Minikube or K3s setup.
- [ ] **Manifests:** Write `deployment.yaml`, `service.yaml`, `ingress.yaml`.
- [ ] **Zero-Downtime:** Configure Readiness/Liveness probes.
- [ ] **Scaling:** Set up Horizontal Pod Autoscaler (HPA) for Weather Service.

## Phase 10: "Heavy" Feature Engineering
**Objective:** Complex functional requirements.
- [ ] **Async Jobs:** Bulk city processing using BullMQ (Redis).
- [ ] **Observability:** Prometheus (Metrics) + Grafana (Dashboards).
- [ ] **Rate Limiting:** Protect APIs using Redis middleware.

---

## Technical Stack Evolution

| Component | v1.0.0 (MVP) | v2.0.0 (Scale-Up) |
|-----------|--------------|-------------------|
| **Runtime** | Node.js | Docker Containers |
| **Orchestration** | npm start | Kubernetes / Docker Compose |
| **Database** | SQLite | PostgreSQL |
| **Session** | In-Memory | Redis |
| **Communication** | Monolith | HTTP / Message Queue |
| **Monitoring** | console.log | Prometheus + Grafana |
