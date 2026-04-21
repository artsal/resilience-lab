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

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={{ textAlign: "center" }}>🧪 Resilience Lab</h1>

        {/* METRICS */}
        <div style={metrics}>
          Total: {events.length} |
          <span style={{ color: "#2ecc71" }}> Success: {success}</span> |
          <span style={{ color: "#f39c12" }}> DLQ: {dlq}</span>
        </div>

        {/* FILTERS */}
        <div style={row}>
          {["ALL", "SUCCESS", "DLQ"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...filterPill,
                background: filter === f ? "#1f6feb" : "transparent",
                color: filter === f ? "#fff" : "#ccc",
                border: filter === f ? "1px solid #1f6feb" : "1px solid #444",
              }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              {f}
            </button>
          ))}
        </div>

        {/* CHAOS */}
        <div style={row}>
          <span>
            Failure:
            <b
              style={{
                marginLeft: 5,
                color: chaos.failEnabled ? "#e74c3c" : "#2ecc71",
              }}
            >
              {chaos.failEnabled ? " ON" : " OFF"}
            </b>
          </span>

          <span>
            Latency:
            <b style={{ marginLeft: 5 }}>
              {chaos.delayMs > 0 ? `${chaos.delayMs} ms` : "OFF"}
            </b>
          </span>

          <input
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            placeholder="Delay ms"
            style={input}
          />

          <button
            style={primaryBtn}
            onClick={setChaosDelay}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            Set Delay
          </button>
          <button
            style={secondaryBtn}
            onClick={resetDelay}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            Reset
          </button>
        </div>

        {/* INPUT */}
        <div style={row}>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            style={input}
          />
          <button
            style={primaryBtn}
            onClick={sendEvent}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            Send
          </button>
        </div>

        {/* ACTIONS */}
        <div style={row}>
          <button
            style={warningBtn}
            onClick={sendBulk}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            {loading ? "Sending..." : "Bulk"}
          </button>

          <button
            style={dangerBtn}
            onClick={enableFailure}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            Enable Failure
          </button>

          <button
            style={successBtn}
            onClick={disableFailure}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            Disable Failure
          </button>
        </div>

        {/* TABLE */}
        <div style={tableBox}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#161b22" }}>
                <th style={cell}>Event ID</th>
                <th style={cell}>User</th>
                <th style={cell}>Status</th>
                <th style={cell}>Replay</th>
              </tr>
            </thead>

            <tbody>
              {visibleEvents.map((e, i) => (
                <tr
                  key={e.eventId}
                  style={{ background: i % 2 ? "#161b22" : "transparent" }}
                >
                  <td style={cell}>{e.eventId}</td>
                  <td style={cell}>{e.userId}</td>
                  <td style={cell}>
                    <StatusBadge status={e.status} />
                  </td>

                  <td style={cell}>
                    {e.status === "DLQ" ? (
                      <button
                        style={primaryBtn}
                        onClick={() => replayEvent(e)}
                        onMouseEnter={hoverIn}
                        onMouseLeave={hoverOut}
                      >
                        Replay
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

        {/* COUNT */}
        <div style={countText}>
          Showing {visibleEvents.length} / {filtered.length} events
        </div>

        {/* LOAD MORE */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button
              style={secondaryBtn}
              onClick={() => setVisibleCount((v) => v + 20)}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <footer style={footer}>
        <div>
          © {new Date().getFullYear()} Arthur Salla. All rights reserved.
        </div>
        <div>Crafted with 🔥 using Spring Boot, React, Kafka & MongoDB.</div>
      </footer>
    </div>
  );
}

/* ---------- HOVER ---------- */
const hoverIn = (e) => {
  e.currentTarget.style.opacity = 0.9;
  e.currentTarget.style.transform = "translateY(-1px)";
};

const hoverOut = (e) => {
  e.currentTarget.style.opacity = 1;
  e.currentTarget.style.transform = "translateY(0)";
};

/* ---------- STYLES ---------- */
const page = {
  minHeight: "100vh",
  background: "#0d1117",
  color: "#e6edf3",
  display: "flex",
  flexDirection: "column",
};

const container = {
  maxWidth: "1100px",
  margin: "auto",
  padding: "30px 20px",
  flex: 1,
};

const metrics = { textAlign: "center", marginBottom: 20 };

const row = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};

const tableBox = {
  height: 420,
  overflowY: "auto",
  border: "1px solid #30363d",
  borderRadius: 6,
};

const cell = { padding: "12px", textAlign: "center" };

const countText = {
  textAlign: "center",
  marginTop: 8,
  fontSize: 13,
  color: "#888",
};

const footer = {
  textAlign: "center",
  margin: "5px",
  color: "#888",
  fontSize: 14,
};

const baseBtn = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const primaryBtn = { ...baseBtn, background: "#3498db", color: "#fff" };
const dangerBtn = { ...baseBtn, background: "#e74c3c", color: "#fff" };
const successBtn = { ...baseBtn, background: "#2ecc71", color: "#fff" };
const warningBtn = { ...baseBtn, background: "#f39c12", color: "#fff" };

// UPDATED SECONDARY BUTTON (visible now)
const secondaryBtn = {
  ...baseBtn,
  background: "#2c2f36",
  border: "1px solid #555",
  color: "#ddd",
};

const filterPill = {
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "13px",
};

const input = {
  padding: "6px",
  borderRadius: 4,
  border: "1px solid #444",
  background: "#111",
  color: "#fff",
};

function StatusBadge({ status }) {
  const map = {
    SUCCESS: "#2ecc71",
    DLQ: "#f39c12",
    FAILED: "#e74c3c",
    PROCESSING: "#3498db",
    REPLAYING: "#9b59b6",
  };

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 4,
        background: map[status],
        color: "#fff",
        fontSize: 12,
      }}
    >
      {status}
    </span>
  );
}

export default App;
