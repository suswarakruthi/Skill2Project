import { useEffect, useState } from "react";

const initialTasks = [
  { id: 1, section: "DSA & Coding", title: "Practice Java basics", done: false },
  { id: 2, section: "DSA & Coding", title: "Solve 2 array or string problems", done: false },
  { id: 3, section: "Core Subjects", title: "Revise OOPs concepts", done: false },
  { id: 4, section: "Core Subjects", title: "Study DBMS and SQL", done: false },
  { id: 5, section: "Interview Skills", title: "Practice one technical interview question", done: false },
  { id: 6, section: "Interview Skills", title: "Improve resume or project explanation", done: false },
];

export default function PlacementPreparation() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skill2project-placement-prep")) || initialTasks;
    } catch {
      return initialTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem("skill2project-placement-prep", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((t) => t.done).length;
  const progress = Math.round(completed / tasks.length * 100);
  const sections = ["DSA & Coding", "Core Subjects", "Interview Skills"];

  return (
    <main style={{ minHeight: "100vh", padding: 30, color: "#f7f3ff", background: "radial-gradient(ellipse at top,#29205c,#0b081a 65%)", fontFamily: "Inter,system-ui,sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <button onClick={() => window.location.href = "/dashboard"} style={{ padding: "10px 16px", borderRadius: 10, color: "#c4a6ff", background: "transparent", border: "1px solid #7557bc", cursor: "pointer" }}>← Back to Dashboard</button>
        <p style={{ color: "#b8a2ff", marginTop: 28 }}>SKILL2PROJECT / CAREER GROWTH</p>
        <h1>Placement Preparation 🚀</h1>
        <p style={{ color: "#b8b1d1" }}>Prepare for coding rounds, technical interviews and placements.</p>

        <section style={{ background: "#171331", border: "1px solid #514078", borderRadius: 18, padding: 22, marginTop: 24 }}>
          <h2>Preparation Progress — {progress}%</h2>
          <p>{completed} of {tasks.length} tasks completed</p>
          <div style={{ height: 10, background: "#30284b", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#8956ff,#55e4e1)" }} />
          </div>
        </section>

        {sections.map((section) => (
          <section key={section} style={{ background: "#171331", border: "1px solid #514078", borderRadius: 18, padding: 20, marginTop: 20 }}>
            <h2>{section}</h2>
            {tasks.filter((t) => t.section === section).map((task) => (
              <label key={task.id} style={{ display: "flex", gap: 12, padding: 14, borderTop: "1px solid #ffffff15", cursor: "pointer" }}>
                <input type="checkbox" checked={task.done} onChange={() => setTasks((old) => old.map((t) => t.id === task.id ? { ...t, done: !t.done } : t))} />
                <span style={{ textDecoration: task.done ? "line-through" : "none" }}>{task.title}</span>
              </label>
            ))}
          </section>
        ))}
        <p style={{ color: "#9189ad", marginTop: 24 }}>Your checklist is saved in this browser automatically.</p>
      </div>
    </main>
  );
}
