# 📥 Event Service

Handles event ingestion and publishes messages to Kafka.

---

## 👨‍💻 Author

**Arthur Salla**

---

## 🧠 Responsibility

- Accept incoming events
- Produce messages to Kafka topic

---

## 🔗 API Endpoints

```text
POST /api/events
POST /api/events/bulk?count=100
```

---

## ⚙️ Tech Stack

- Spring Boot
- Kafka Producer
- REST APIs

---

## 🧠 Flow

```text
Client → Event Service → Kafka
```

---

## ⚙️ Configuration

- Kafka bootstrap servers
- Topic configuration
- Environment profiles (local / docker)

---

## 🎯 Design Notes

- Stateless service
- Designed for scalability
- Decouples producer from consumer
