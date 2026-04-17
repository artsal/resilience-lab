# 📡 Event Service

## 📌 Purpose

Acts as the **entry point** of the system.
Accepts API requests and publishes events to Kafka.

---

## 🚀 Responsibilities

- Exposes REST API (`/api/events`)
- Generates event IDs
- Publishes events to Kafka topic: `events-topic`

---

## 🧪 Example API

### POST /api/events

```json
{
  "type": "USER_SIGNUP",
  "payload": {
    "userId": "123"
  }
}
```

---

## 🔁 Flow

```
Client → Event Service → Kafka
```

---

## ⚙️ Running

```bash
mvn spring-boot:run
```

Runs on:

```
http://localhost:8080
```

---

## 📘 Swagger

```
http://localhost:8080/swagger-ui.html
```
