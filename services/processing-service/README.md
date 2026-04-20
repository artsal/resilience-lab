# ⚙️ Processing Service

## 📌 Purpose

Consumes events from Kafka and processes them with **chaos simulation**.

---

## 🚀 Features

* Kafka consumer
* Failure simulation
* Delay simulation
* Retry with backoff
* Dead Letter Queue (DLQ)
* Manual replay support

---

## 🎮 Chaos Controls

### Enable Failure

```
POST /api/chaos/failure?enabled=true
```

### Set Delay

```
POST /api/chaos/delay?ms=3000
```

### Get Chaos State

```
GET /api/chaos
```

---

## 🔁 Replay API

```
POST /api/replay
```

---

## 🔄 Processing Flow

```
Kafka → Processing → Success
                ↓
              Failure
                ↓
            Retry (3x)
                ↓
              DLQ
                ↓
            Manual Replay
```

---

## ⚙️ Running

```bash
mvn spring-boot:run
```

Runs on:

```
http://localhost:8081
```

---

## 📘 Swagger

```
http://localhost:8081/swagger-ui/index.html
```

---

## 🧠 Key Concepts Demonstrated

* At-least-once delivery
* Offset management
* Retry strategies
* DLQ handling
* Chaos engineering basics
