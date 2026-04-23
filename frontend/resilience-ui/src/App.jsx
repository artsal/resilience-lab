import { useEffect, useState, useRef } from "react";
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
  const [demoPhase, setDemoPhase] = useState("");

  const prevStatusRef = useRef({});
  const [changedMap, setChangedMap] = useState({});

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const isDisabled = demoRunning;

  useEffect(() => {
    fetchEvents();
    fetchChaos();

    const interval = setInterval(() => {
      fetchEvents();
      fetchChaos();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get(`${API_PROCESSING}/api/events`);
    const newEvents = res.data.sort((a, b) => b.createdAt - a.createdAt);

    const newChangedMap = {};
    newEvents.forEach((e) => {
      const prev = prevStatusRef.current[e.eventId];
      if (prev && prev !== e.status) {
        newChangedMap[e.eventId] = true;
      }
    });

    const nextMap = {};
    newEvents.forEach((e) => {
      nextMap[e.eventId] = e.status;
    });

    prevStatusRef.current = nextMap;
    setChangedMap(newChangedMap);
    setEvents(newEvents);
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

  const runDemo = async () => {
    if (demoRunning) return;

    setDemoRunning(true);

    const demoEventIds = [];

    try {
      setDemoPhase("Injecting latency...");
      await axios.post(`${API_PROCESSING}/api/chaos/delay?ms=2000`);
      await sleep(1000);

      setDemoPhase("Enabling failure...");
      await enableFailure();
      await sleep(1000);

      setDemoPhase("Sending events...");
      for (let i = 0; i < 10; i++) {
        const id = `demo-${i}-${Date.now()}`;
        demoEventIds.push(id);

        await axios.post(`${API_EVENT}/api/events`, {
          type: "USER_SIGNUP",
          payload: { userId: id },
        });

        await sleep(400);
      }

      await sleep(5000);

      setDemoPhase("Disabling failure...");
      await disableFailure();
      await sleep(2000);

      setDemoPhase("Replaying DLQ...");
      await fetchEvents();

      const dlqEvents = events.filter(
        (e) => e.status === "DLQ" && demoEventIds.includes(e.userId),
      );

      for (const e of dlqEvents) {
        await replayEvent(e);
        await sleep(400);
      }

      await resetDelay();
      setDemoPhase("Completed");
    } finally {
      setDemoRunning(false);
    }
  };

  const getFlashClass = (status) => {
    const map = {
      SUCCESS: "flash-green",
      FAILED: "flash-red",
      DLQ: "flash-orange",
      PROCESSING: "flash-blue",
    };
    return map[status] || "";
  };

  return (
    <div style={page}>
      <style>{`
        @keyframes flashGreen { 0%{background:#2ecc7160;} 100%{background:transparent;} }
        @keyframes flashRed { 0%{background:#e74c3c60;} 100%{background:transparent;} }
        @keyframes flashOrange { 0%{background:#f39c1260;} 100%{background:transparent;} }
        @keyframes flashBlue { 0%{background:#3498db60;} 100%{background:transparent;} }

        .flash-green { animation: flashGreen 0.8s ease; }
        .flash-red { animation: flashRed 0.8s ease; }
        .flash-orange { animation: flashOrange 0.8s ease; }
        .flash-blue { animation: flashBlue 0.8s ease; }
      `}</style>

      <div style={container}>
        <h1 style={{ textAlign: "center" }}>🧪 Resilience Lab</h1>

        <div style={narrative}>
          Simulating failure, retries, DLQ and recovery in an event-driven
          system
        </div>

        {/* Latency */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{ color: "#58a6ff" }}>
            Latency: {chaos.delayMs ? `${chaos.delayMs} ms` : "OFF"}
          </span>
        </div>

        {/* Status */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          {chaos.failEnabled ? (
            <span style={{ color: "#e74c3c" }}>🔴 Failure Mode ON</span>
          ) : (
            <span style={{ color: "#2ecc71" }}>🟢 System Healthy</span>
          )}
        </div>

        {/* Demo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button disabled={isDisabled} onClick={runDemo} style={demoBtn}>
            {demoRunning ? "⏳ Demo in Progress..." : "▶ Run Chaos Demo"}
          </button>
          {demoRunning && <div>{demoPhase}</div>}
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
        <div style={section}>
          <div style={group}>
            <input
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              placeholder="Delay ms"
              style={input}
            />
            <button
              disabled={isDisabled}
              style={primaryBtn}
              onClick={setChaosDelay}
            >
              Set Delay
            </button>
            <button
              disabled={isDisabled}
              style={secondaryBtn}
              onClick={resetDelay}
            >
              Reset
            </button>
          </div>

          <div style={group}>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              style={input}
            />
            <button
              disabled={isDisabled}
              style={primaryBtn}
              onClick={sendEvent}
            >
              Send
            </button>
          </div>
        </div>

        <div style={section}>
          <button disabled={isDisabled} style={warningBtn} onClick={sendBulk}>
            {loading ? "Sending..." : "Bulk"}
          </button>
          <button
            disabled={isDisabled}
            style={dangerBtn}
            onClick={enableFailure}
          >
            Enable Failure
          </button>
          <button
            disabled={isDisabled}
            style={successBtn}
            onClick={disableFailure}
          >
            Disable Failure
          </button>
        </div>

        {/* Table */}
        <div style={tableBox}>
          <table style={{ width: "100%" }}>
            <tbody>
              {visibleEvents.map((e) => {
                const changed = changedMap[e.eventId];
                return (
                  <tr
                    key={e.eventId}
                    className={changed ? getFlashClass(e.status) : ""}
                  >
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button
              disabled={isDisabled}
              style={primaryBtn}
              onClick={() => setVisibleCount((v) => v + 20)}
            >
              Load More
            </button>
          </div>
        )}

        <div style={countText}>
          Showing {visibleEvents.length} / {filtered.length}
        </div>
      </div>

      <footer style={footer}>
        <div style={{ fontSize: 14 }}>
          © {new Date().getFullYear()} Reo Leo. All rights reserved.
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

/* STYLES UNCHANGED BELOW */

const section = {
  display: "flex",
  justifyContent: "center",
  gap: 30,
  marginBottom: 20,
  flexWrap: "wrap",
};
const group = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#161b22",
  padding: "10px 14px",
  borderRadius: 8,
};
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
