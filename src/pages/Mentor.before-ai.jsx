import { useState } from "react";
import { Link } from "react-router-dom";

const quickPrompts = [
  "Suggest a project based on my skills",
  "Which technologies should I learn next?",
  "Create a step-by-step project plan"
];

export default function Mentor() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Skill2Project AI Mentor. Tell me your skills or project idea, and let's build something useful."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(value = input) {
    const question = value.trim();
    if (!question || loading) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: question }
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.reply }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: `Couldn't get an AI response: ${error.message}. Check that the backend is running and the Gemini API key and quota are valid.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const panel = {
    background: "#15112de8",
    border: "1px solid #9d8aff50",
    borderRadius: 18,
    padding: 20
  };

  return (
    <main style={{
      minHeight: "100vh",
      padding: "32px 18px",
      background: "radial-gradient(ellipse at top, #241454, #08051c 65%)",
      color: "#f7f5ff",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link to="/dashboard" style={{ color: "#b8a5ff", textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>

        <header style={{ ...panel, marginTop: 22, marginBottom: 18 }}>
          <div style={{ fontSize: 38 }}>🔮</div>
          <h1 style={{ margin: "8px 0" }}>AI Project Mentor</h1>
          <p style={{ color: "#bcb5d8", marginBottom: 0 }}>
            Turn your skills and ideas into a practical project plan.
          </p>
        </header>

        <section style={{ ...panel, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                disabled={loading}
                onClick={() => sendMessage(prompt)}
                style={{
                  padding: "10px 13px", borderRadius: 12,
                  border: "1px solid #8e72ff70",
                  background: "#241943", color: "#eee8ff",
                  cursor: loading ? "wait" : "pointer"
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div aria-live="polite" style={{
            display: "flex", flexDirection: "column", gap: 12,
            minHeight: 260, maxHeight: "48vh", overflowY: "auto",
            padding: 8
          }}>
            {messages.map((message, index) => (
              <div key={index} style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%", padding: "12px 15px", borderRadius: 14,
                background: message.role === "user" ? "#6741e8" : "#211b3b",
                lineHeight: 1.6, whiteSpace: "pre-wrap", overflowWrap: "anywhere"
              }}>
                <strong style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
                  {message.role === "user" ? "You" : "Skill2Project AI Mentor"}
                </strong>
                {message.text}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: "flex-start", padding: 12, borderRadius: 12,
                background: "#211b3b", color: "#c7b9ff"
              }}>
                Gemini is thinking...
              </div>
            )}
          </div>

          <form onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }} style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about skills, projects or career..."
              aria-label="Message to AI Mentor"
              style={{
                flex: 1, minWidth: 0, padding: 14, borderRadius: 12,
                border: "1px solid #514274", background: "#0e0a20",
                color: "white", outline: "none"
              }}
            />
            <button type="submit" disabled={loading || !input.trim()} style={{
              border: 0, borderRadius: 12, padding: "0 22px",
              background: "#7045ee", color: "white",
              fontWeight: 700, cursor: "pointer",
              opacity: loading || !input.trim() ? 0.6 : 1
            }}>
              {loading ? "Wait..." : "Send"}
            </button>
          </form>

          <p style={{ color: "#aaa6c7", fontSize: 12, margin: 0 }}>
            Powered by Gemini AI · Responses require an available API quota.
          </p>
        </section>
      </div>
    </main>
  );
}

