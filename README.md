# 🧪 Resilience Lab

An event-driven platform to simulate failure, recovery, and scalability in distributed systems.

## 🏗️ Architecture

```
event-service → Kafka → processing-service
```

## 🚀 Tech Stack

* Java, Spring Boot (Microservices)
* Apache Kafka (Event Streaming)
* Docker (Kafka setup)
* Swagger (API testing)

## 🧩 Services

### 1. Event Service

* Accepts API requests
* Publishes events to Kafka

### 2. Processing Service

* Consumes events from Kafka
* Processes events (with failure simulation)

## 🎯 Goals

* Understand event-driven architecture
* Simulate failures and recovery
* Build resilient distributed systems

## 🔄 Current Status

* ✅ Kafka integration complete
* ✅ Producer + Consumer working
* ⏳ Failure handling (in progress)
