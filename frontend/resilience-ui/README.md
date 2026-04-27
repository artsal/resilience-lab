# 🎨 Frontend — Resilience Lab UI

A lightweight React-based interface to interact with the event-driven backend system.

---

## 👨‍💻 Author

**Arthur Salla**

---

## 🧠 Purpose

The frontend acts as:

- Entry point to the system
- Event generator
- Visualization trigger for backend behavior

---

## ⚙️ Tech Stack

- React (Vite)
- Axios
- Custom CSS

---

## 🚀 Features

- Send single event
- Generate bulk events
- Trigger chaos mode
- Real-time interaction with backend

---

## 🔗 API Communication

All requests are routed via:

```text
http://localhost:8082
```

(API Gateway)

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

---

## 🌍 Environment Configuration

Create `.env`:

```text
VITE_API_BASE_URL=http://localhost:8082
```

---

## 🎯 Design Philosophy

- Minimal UI, maximum backend visibility
- Focus on system behavior, not UI complexity

---

## 🚀 Future Improvements

- Better UX & animations
- Error handling UI
- Authentication integration
