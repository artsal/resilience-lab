import { useEffect, useState } from "react";
import axios from "axios";

const API_PROCESSING = "http://localhost:8081";
const API_EVENT = "http://localhost:8080";

function App() {
  const [events, setEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [filter, setFilter] = useState("ALL");

  const [delay, setDelay] = useState("");
  const [chaos, setChaos] = useState({});
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [demoRunning, setDemoRunning] = useState(false);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const isDisabled = demoRunning;

  useEffect(() => {
    fetchEvents();
    fetchChaos();

    const interval = setInterval(() => {
      fetchEvents();
      fetchChaos();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get(`${API_PROCESSING}/api/events`);
    setEvents(res.data.sort((a, b) => b.createdAt - a.createdAt));
  };

  const fetchChaos = async () => {
    const res = await axios.get(`${API_PROCESSING}/api/chaos`);
    setChaos(res.data);
  };

  const filtered = events.filter((e) =>
    filter === "ALL" ? true : e.status === filter,
  );

  const visibleEvents = filtered.slice(0, visibleCount);

  const success = events.filter((e) => e.status === "SUCCESS").length;
  const dlq = events.filter((e) => e.status === "DLQ").length;

  const sendEvent = async () => {
    if (!userId.trim()) return;

    await axios.post(`${API_EVENT}/api/events`, {
      type: "USER_SIGNUP",
      payload: { userId },
    });

    setUserId("");
    fetchEvents();
  };

  const sendBulk = async () => {
    setLoading(true);
    await axios.post(`${API_EVENT}/api/events/bulk?count=10`);
    setTimeout(() => {
      fetchEvents();
      setLoading(false);
    }, 1000);
  };

  const enableFailure = async () => {
    await axios.post(`${API_PROCESSING}/api/chaos/failure?enabled=true`);
    fetchChaos();
  };

  const disableFailure = async () => {
    await axios.post(`${API_PROCESSING}/api/chaos/failure?enabled=false`);
    fetchChaos();
  };

  const setChaosDelay = async () => {
    if (!delay) return;
    await axios.post(`${API_PROCESSING}/api/chaos/delay?ms=${delay}`);
    setDelay("");
    fetchChaos();
  };

  const resetDelay = async () => {
    await axios.post(`${API_PROCESSING}/api/chaos/delay?ms=0`);
    fetchChaos();
  };

  const replayEvent = async (event) => {
    await axios.post(`${API_PROCESSING}/api/replay`, event);
    fetchEvents();
  };

  // 🔥 DEMO MODE
  const runDemo = async () => {
    if (demoRunning) return;

    setDemoRunning(true);

    try {
      await axios.post(`${API_EVENT}/api/events/bulk?count=15`);
      await sleep(2000);

      await axios.post(`${API_PROCESSING}/api/chaos/failure?enabled=true`);
      await sleep(5000);

      await axios.post(`${API_PROCESSING}/api/chaos/failure?enabled=false`);
      await sleep(2000);

      const dlqEvents = events.filter((e) => e.status === "DLQ");

      for (const e of dlqEvents) {
        await axios.post(`${API_PROCESSING}/api/replay`, e);
        await sleep(300);
      }

      fetchEvents();
    } finally {
      setDemoRunning(false);
    }
  };

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={{ textAlign: "center" }}>🧪 Resilience Lab</h1>

        {/* Narrative */}
        <div style={narrative}>
          Simulating failure, retries, DLQ and recovery in an event-driven
          system
        </div>

        {/* Status */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          {chaos.failEnabled ? (
            <span style={{ color: "#e74c3c" }}>🔴 Failure Mode ON</span>
          ) : (
            <span style={{ color: "#2ecc71" }}>🟢 System Healthy</span>
          )}
        </div>

        {/* Demo Button */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button
            disabled={isDisabled}
            onClick={runDemo}
            style={{
              ...demoBtn,
              opacity: isDisabled ? 0.6 : 1,
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
          >
            {demoRunning ? "⏳ Demo in Progress..." : "▶ Run Chaos Demo"}
          </button>
        </div>

        {/* Metrics */}
        <div style={metricsRow}>
          <div style={card}>
            Total
            <br />
            <b>{events.length}</b>
          </div>
          <div style={{ ...card, color: "#2ecc71" }}>
            Success
            <br />
            <b>{success}</b>
          </div>
          <div style={{ ...card, color: "#f39c12" }}>
            DLQ
            <br />
            <b>{dlq}</b>
          </div>
        </div>

        {/* Filters */}
        <div style={row}>
          {["ALL", "SUCCESS", "DLQ"].map((f) => (
            <button
              key={f}
              disabled={isDisabled}
              onClick={() => setFilter(f)}
              style={{
                ...filterPill,
                background: filter === f ? "#1f6feb" : "transparent",
                color: filter === f ? "#fff" : "#ccc",
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={row}>
          <input
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            placeholder="Delay ms"
            style={input}
          />
          <button
            disabled={isDisabled}
            style={{ ...primaryBtn, opacity: isDisabled ? 0.5 : 1 }}
            onClick={setChaosDelay}
          >
            Set Delay
          </button>
          <button
            disabled={isDisabled}
            style={{ ...secondaryBtn, opacity: isDisabled ? 0.5 : 1 }}
            onClick={resetDelay}
          >
            Reset
          </button>
        </div>

        <div style={row}>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            style={input}
          />
          <button
            disabled={isDisabled}
            style={{ ...primaryBtn, opacity: isDisabled ? 0.5 : 1 }}
            onClick={sendEvent}
          >
            Send
          </button>
        </div>

        <div style={row}>
          <button
            disabled={isDisabled}
            style={{ ...warningBtn, opacity: isDisabled ? 0.5 : 1 }}
            onClick={sendBulk}
          >
            {loading ? "Sending..." : "Bulk"}
          </button>
          <button
            disabled={isDisabled}
            style={{ ...dangerBtn, opacity: isDisabled ? 0.5 : 1 }}
            onClick={enableFailure}
          >
            Enable Failure
          </button>
          <button
            disabled={isDisabled}
            style={{ ...successBtn, opacity: isDisabled ? 0.5 : 1 }}
            onClick={disableFailure}
          >
            Disable Failure
          </button>
        </div>

        {/* Table */}
        <div style={tableBox}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={cell}>Event ID</th>
                <th style={cell}>User</th>
                <th style={cell}>Status</th>
                <th style={cell}>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleEvents.map((e) => (
                <tr key={e.eventId}>
                  <td style={cell}>{e.eventId}</td>
                  <td style={cell}>{e.userId}</td>
                  <td style={cell}>
                    <StatusBadge status={e.status} />
                  </td>
                  <td style={cell}>
                    {e.status === "DLQ" ? (
                      <button
                        disabled={isDisabled}
                        style={primaryBtn}
                        onClick={() => replayEvent(e)}
                      >
                        🔁 Recover
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={countText}>
          Showing {visibleEvents.length} / {filtered.length}
        </div>

        {visibleCount < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button
              disabled={isDisabled}
              style={secondaryBtn}
              onClick={() => setVisibleCount((v) => v + 20)}
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <footer style={footer}>
        <div style={{ fontSize: 14 }}>
          © {new Date().getFullYear()} Arthur Salla. All rights reserved.
        </div>
        <div style={{ fontSize: 12, color: "#8b949e" }}>
          Resilience Lab — Distributed Systems Simulation
        </div>
        <div style={{ fontSize: 12, color: "#6e7681" }}>
          Crafted with 🔥 using Spring Boot, Kafka, MongoDB, React, Prometheus &
          Grafana
        </div>
      </footer>
    </div>
  );
}

/* ---------- STYLES ---------- */

const page = { background: "#0d1117", color: "#e6edf3", minHeight: "100vh" };
const container = { maxWidth: 1100, margin: "auto", padding: 20 };
const row = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};
const metricsRow = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginBottom: 20,
};
const card = { padding: 12, background: "#161b22", borderRadius: 8 };
const input = { padding: 6 };
const tableBox = { maxHeight: 400, overflowY: "auto" };
const cell = { padding: 10, textAlign: "center" };
const countText = { textAlign: "center", marginTop: 10 };
const footer = {
  textAlign: "center",
  padding: "16px 10px",
  borderTop: "1px solid #30363d",
  marginTop: "30px",
  color: "#8b949e",
};

const primaryBtn = {
  background: "#3498db",
  color: "#fff",
  padding: "6px 12px",
};
const secondaryBtn = { background: "#444", color: "#fff", padding: "6px 12px" };
const warningBtn = {
  background: "#f39c12",
  color: "#fff",
  padding: "6px 12px",
};
const dangerBtn = { background: "#e74c3c", color: "#fff", padding: "6px 12px" };
const successBtn = {
  background: "#2ecc71",
  color: "#fff",
  padding: "6px 12px",
};
const demoBtn = { background: "#8e44ad", color: "#fff", padding: "10px 16px" };
const filterPill = { padding: "6px 12px", borderRadius: 20 };
const narrative = { textAlign: "center", marginBottom: 20, color: "#8b949e" };

function StatusBadge({ status }) {
  const map = {
    SUCCESS: "#2ecc71",
    DLQ: "#f39c12",
    FAILED: "#e74c3c",
    PROCESSING: "#3498db",
    REPLAYING: "#9b59b6",
  };
  return <span style={{ background: map[status], padding: 4 }}>{status}</span>;
}

export default App;
