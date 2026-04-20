# 🧪 Resilience Lab

A distributed system simulator that demonstrates **failure handling, retries, dead-letter queues, and recovery** using modern backend technologies.

---

## 🚀 What This Project Demonstrates

* Event-driven architecture using Kafka
* Failure simulation (Chaos Engineering concepts)
* Retry mechanisms with backoff
* Dead Letter Queue (DLQ) handling
* Manual replay and system recovery
* Traffic spikes and latency simulation

---

## 🏗️ Architecture

```
Client → Event Service → Kafka → Processing Service
                                      ↓
                                   (Failure)
                                      ↓
                               DLQ (Kafka)
                                      ↓
                             Replay (Manual)
                                      ↓
                              Back to Kafka
```

---

## 🧩 Services

| Service                   | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| event-service             | Produces events to Kafka                              |
| processing-service        | Consumes events, applies chaos, handles retries & DLQ |
| (optional) replay-service | Handles replay of failed events (future enhancement)  |

---

## 🎮 Chaos Features

* Toggle failure mode
* Add processing delay
* Generate bulk traffic
* Replay failed events

---

## 🔧 Tech Stack

* Java + Spring Boot
* Apache Kafka
* Docker (Kafka setup)
* Swagger / OpenAPI
* (Upcoming) MongoDB
* (Upcoming) React UI
* (Upcoming) Prometheus + Grafana

---

## 🧪 Demo Scenarios

### ✅ Normal Flow

Event → Processed successfully

### 💥 Failure Flow

Event → Retry → DLQ

### 🔁 Recovery Flow

DLQ → Replay → Success

### ⏱️ Latency Simulation

Artificial delay in processing

### 📈 Traffic Spike

Bulk events causing backlog

---

## 🏃 How to Run

1. Start Kafka (Docker)
2. Run `event-service`
3. Run `processing-service`
4. Open Swagger UIs

---

## 🎯 Why This Project

This project simulates **real-world distributed system failures and recovery**, making it a strong showcase of backend engineering and system design skills.
