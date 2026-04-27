# 🌐 API Gateway

Central entry point for all client interactions.

---

## 👨‍💻 Author

**Arthur Salla**

---

## 🧠 Responsibilities

- Route incoming requests
- Handle CORS
- Centralize traffic management
- Enable monitoring & logging

---

## ⚙️ Tech Stack

- Spring Cloud Gateway
- WebFlux

---

## 🔗 Routes

```text
/api/events → event-service (POST)
/api/events → processing-service (GET)
/api/chaos → processing-service
```

---

## 🔥 Features

- Global logging filter
- Centralized routing
- Metrics collection
- Alert webhook integration

---

## 📊 Metrics

- http_server_requests_seconds_count
- Gateway traffic metrics

---

## 🚨 Alert Integration

Receives alerts via:

```text
POST /api/webhook
```

---

## 🧠 Architecture Role

```text
Frontend → Gateway → Microservices
```

---

## 🎯 Why API Gateway?

- Simplifies client interactions
- Centralizes observability
- Enables scalability & control
