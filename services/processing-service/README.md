# ⚙️ Processing Service

Core service responsible for consuming and processing events.

---

## 👨‍💻 Author

**Arthur Salla**

---

## 🧠 Responsibilities

- Consume Kafka events
- Process business logic
- Persist data to MongoDB
- Handle failures (DLQ)

---

## ⚙️ Tech Stack

- Spring Boot
- Kafka Consumer
- MongoDB
- Micrometer (metrics)

---

## 🔥 Key Features

- Dead Letter Queue (DLQ)
- Retry handling
- Chaos testing support

---

## 📊 Metrics

- events_processed_total
- events_dlq_total

---

## 🧠 Flow

```text
Kafka → Processing Service → MongoDB
```

---

## ⚠️ Failure Handling

- Failed events → DLQ
- Metrics updated → alerts triggered

---

## 🎯 Role in System

This is the **core processing engine**, responsible for business logic execution.
