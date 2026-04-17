# ⚙️ Processing Service

## 📌 Purpose

Consumes events from Kafka and processes them.

---

## 🚀 Responsibilities

- Listens to Kafka topic: `events-topic`
- Processes incoming events
- Simulates failures (for resilience testing)

---

## 🔁 Flow

```
Kafka → Processing Service
```

---

## 🧪 Example Output

```
📥 Received event: {...}
✅ Successfully processed event: ...
```

or

```
💥 Simulated failure for event: ...
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

## 🧠 Notes

- Uses Kafka consumer group: `resilience-group`
- Demonstrates async processing and failure scenarios
