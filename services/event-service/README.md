# 📡 Event Service

## 📌 Purpose

Acts as the **entry point** of the system.

* Accepts API requests
* Publishes events to Kafka

---

## 🚀 Features

* Send single event
* Generate bulk events (traffic simulation)
* Swagger API support

---

## 🧪 APIs

### POST /api/events

Send a single event

### POST /api/events/bulk?count=10

Generate multiple events

---

## 🔁 Flow

```
Client → Event Service → Kafka (events-topic)
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
http://localhost:8080/swagger-ui/index.html
```
