![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![Kafka](https://img.shields.io/badge/Kafka-Event--Driven-black)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-orange)
![Grafana](https://img.shields.io/badge/Grafana-Dashboards-yellow)
![Status](https://img.shields.io/badge/Status-Production--Style-success)

# 🚀 Resilience Lab — Event-Driven Microservices System

A production-style, event-driven microservices platform designed to demonstrate **resilience, observability, and failure handling** using modern backend architecture patterns.

---

## 👨‍💻 Author

**Arthur Salla**

---

## 🧠 Project Vision

Modern distributed systems are not defined by how they behave during success — but by how they behave during failure.

This project simulates a real-world backend system where:

- Services communicate asynchronously via Kafka
- Failures are expected and handled gracefully
- Observability is first-class, not an afterthought
- Alerts are triggered based on real system behavior

---

## 🏗️ Architecture Overview

```text
Frontend (React)
        ↓
API Gateway (Spring Cloud Gateway)
        ↓
Event Service → Kafka → Processing Service → MongoDB
                        ↓
                  Prometheus
                        ↓
                     Grafana
                        ↓
                      Alerts
```

---

## ⚙️ Technology Stack

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Frontend         | React (Vite)                |
| Backend          | Spring Boot (WebFlux + MVC) |
| Messaging        | Apache Kafka                |
| Database         | MongoDB                     |
| Gateway          | Spring Cloud Gateway        |
| Monitoring       | Prometheus (Micrometer)     |
| Visualization    | Grafana                     |
| Containerization | Docker & Docker Compose     |

---

## 🔥 Key Capabilities

### 🟢 Event-Driven Architecture

- Asynchronous communication via Kafka
- Decoupled services for scalability

### 🟢 API Gateway

- Central routing layer
- CORS handling
- Unified entry point

### 🟢 Observability

- Metrics via Micrometer
- Prometheus scraping
- Grafana dashboards

### 🟢 Alerting System

- DLQ spike detection
- Gateway error monitoring (5xx)
- Real-time alert lifecycle (Normal → Pending → Firing)

### 🟢 Chaos Testing

- Simulate downstream failures
- Observe system resilience in real-time

---

## 🧪 Demo Walkthrough

1. Generate events via UI
2. Observe processing pipeline (Kafka → Processing Service)
3. Monitor metrics in Grafana
4. Simulate failure:

   ```bash
   docker stop processing-service
   ```

5. Observe:
   - Gateway errors spike
   - Alerts fire 🔴

6. Restart service:

   ```bash
   docker start processing-service
   ```

7. System recovers automatically

---

## ▶️ Running the Project

### 🐳 Docker (Recommended)

```bash
docker-compose up --build
```

Access:

- Frontend → http://localhost:5173
- API Gateway → http://localhost:8082
- Grafana → http://localhost:3000
- Prometheus → http://localhost:9090

---

### 💻 Local (Development Mode)

Run services via IntelliJ with:

```bash
-Dspring.profiles.active=local
```

---

## 📊 Observability & Monitoring

### Dashboards (Grafana)

- Event throughput
- Total processed events
- DLQ trends
- Gateway traffic
- Error rates

### Alerts

- DLQ spike detection
- Gateway 5xx error rate

---

## 📁 Project Structure

```text
frontend/
services/
  event-service/
  processing-service/
  api-gateway/
infra/
  grafana/
docker-compose.yml
```

---

## 🎯 What This Project Demonstrates

- Microservices architecture design
- Event-driven systems using Kafka
- Observability-first development
- Failure detection & resilience patterns
- Real-world alerting strategies
- Containerized deployments

---

## 🚀 Future Enhancements

- Circuit Breakers (Resilience4j)
- Distributed Tracing (Jaeger)
- Authentication (JWT/OAuth)
- CI/CD Pipeline
- Kubernetes deployment

---

## 💡 Key Takeaway

This project focuses not just on building services, but on building **systems that can be observed, tested, and trusted under failure conditions**.
