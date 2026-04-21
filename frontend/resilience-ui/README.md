# 🧪 Resilience Lab UI

Frontend dashboard for the **Resilience Lab** project — an event-driven system demonstrating failure handling, retries, and recovery using modern backend patterns.

---

## 🚀 Overview

This UI provides a real-time view into how events are processed across the system.

It allows you to:

- 📤 Send events and generate bulk traffic
- 💥 Simulate failures (Chaos Engineering)
- ⏱️ Introduce latency in processing
- 🔁 Replay failed (DLQ) events
- 📊 Monitor system state via metrics and status indicators

---

## 🛠️ Tech Stack

- ⚛️ React (Vite)
- 🌐 Axios
- 📊 Recharts (for upcoming visualizations)
- 🎨 Custom styled UI (dark theme)

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npm run dev
```

### 3. Open in browser

http://localhost:5173

---

## 🔗 Backend Services Required

Make sure the following services are running before using the UI:

| Service            | URL                   |
| ------------------ | --------------------- |
| Event Service      | http://localhost:8080 |
| Processing Service | http://localhost:8081 |

---

## 📊 Features

### 🎯 Event Dashboard

- Displays latest events with status
- Status badges: SUCCESS, DLQ, PROCESSING, REPLAYING

### 🔍 Filtering

- Filter events by:
  - ALL
  - SUCCESS
  - DLQ

### 📈 Metrics

- Total events
- Success count
- DLQ count

### ⚡ Chaos Controls

- Enable / disable failure simulation
- Add artificial latency
- Reset system delay

### 🔁 Replay Mechanism

- Replay events from DLQ
- Observe retry behavior

### 📦 Bulk Events

- Generate multiple events to simulate load

### 📜 Pagination

- Load more events dynamically
- Displays: `Showing X / Y events`

---

## 🎯 Purpose of This Project

This project demonstrates:

- Event-driven architecture
- Failure handling & retry mechanisms
- Dead Letter Queue (DLQ)
- Replay workflows
- Chaos engineering concepts
- Observability-ready design

---

## 🧠 Key Concepts Showcased

- Kafka-based event flow
- Retry + DLQ handling
- Resilience patterns
- Backend-driven UI visualization
- System behavior under failure

---

## 📌 Upcoming Enhancements

- 📊 Charts for event insights
- 📈 Trend visualization (success vs failures)
- 🔍 Advanced filtering & search
- 📡 Prometheus metrics integration
- 📊 Grafana dashboards

---

## 👨‍💻 Author

**Arthur Salla**

---

## 📄 License

This project is for learning and demonstration purposes.
