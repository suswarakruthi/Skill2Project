import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const initialGoals = [
  { title: "Practice Java", category: "Coding", target: "30 minutes daily", is_completed: false },
  { title: "Solve DSA problems", category: "Placements", target: "2 problems daily", is_completed: false },
  { title: "Build a mini project", category: "Projects", target: "Complete one project", is_completed: false },
  { title: "Learn a new skill", category: "Learning", target: "30 minutes daily", is_completed: true },
];

export default function MyGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadGoals() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const user = sessionData.session?.user;
        if (!user) {
          if (active) {
            setMessage("Please log in to save and view your goals.");
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from("my_goals")
          .select("id, title, category, target, is_completed")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data.length === 0) {
          const saved = JSON.parse(
            localStorage.getItem("skill2project-my-goals") || "null"
          );

          const source = Array.isArray(saved) && saved.length
            ? saved.map((g) => ({
                title: g.title,
                category: g.category || "Personal",
                target: g.target || "Your own target",
                is_completed: Boolean(g.done ?? g.is_completed),
              }))
            : initialGoals;

          const { data: inserted, error: insertError } = await supabase
            .from("my_goals")
            .insert(source.map((g) => ({ ...g, user_id: user.id })))
            .select("id, title, category, target, is_completed");

          if (insertError) throw insertError;
          if (active) setGoals(inserted || []);
        } else {
          if (active) setGoals(data);
        }
      } catch (error) {
        if (active) setMessage(error.message || "Could not load goals.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGoals();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (goals.length) {
      localStorage.setItem(
        "skill2project-my-goals",
        JSON.stringify(goals.map((g) => ({ ...g, done: g.is_completed })))
      );
    }
  }, [goals]);

  const completed = goals.filter((goal) => goal.is_completed).length;
  const progress = goals.length
    ? Math.round((completed / goals.length) * 100)
    : 0;

  const addGoal = async (event) => {
    event.preventDefault();
    if (!newGoal.trim() || saving) return;

    setSaving(true);
    setMessage("");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) throw new Error("Please log in first.");

      const { data, error } = await supabase
        .from("my_goals")
        .insert({
          user_id: user.id,
          title: newGoal.trim(),
          category: "Personal",
          target: "Your own target",
          is_completed: false,
        })
        .select("id, title, category, target, is_completed")
        .single();

      if (error) throw error;
      setGoals((current) => [...current, data]);
      setNewGoal("");
    } catch (error) {
      setMessage(error.message || "Could not save this goal.");
    } finally {
      setSaving(false);
    }
  };

  const toggleGoal = async (goal) => {
    setMessage("");
    const nextValue = !goal.is_completed;

    const { data, error } = await supabase
      .from("my_goals")
      .update({ is_completed: nextValue })
      .eq("id", goal.id)
      .select("id");

    if (error || !data?.length) {
      setMessage(error?.message || "Could not update goal.");
      return;
    }

    setGoals((current) =>
      current.map((g) =>
        g.id === goal.id ? { ...g, is_completed: nextValue } : g
      )
    );
  };

  const card = {
    background: "linear-gradient(145deg,#171331,#100c25)",
    border: "1px solid #514078",
    borderRadius: 18,
    padding: 20,
  };

  return (
    <main style={{ minHeight: "100vh", padding: "32px", color: "#f7f3ff", background: "radial-gradient(ellipse at top,#29205c,#0b081a 65%)", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <button type="button" onClick={() => { window.location.href = "/dashboard"; }}
          style={{ background: "transparent", color: "#c4a6ff", border: "1px solid #514078", borderRadius: 10, padding: "10px 16px", cursor: "pointer", marginBottom: 20 }}>
          ← Back to Dashboard
        </button>

        <p style={{ color: "#b8a2ff", letterSpacing: 2, fontSize: 12 }}>SKILL2PROJECT / PERSONAL GROWTH</p>
        <h1 style={{ fontSize: "clamp(30px,5vw,44px)", marginBottom: 8 }}>My Goals 🎯</h1>
        <p style={{ color: "#b8b1d1" }}>Small steps today. Bigger achievements tomorrow.</p>

        {message && <p role="status" style={{ color: "#ffb4c2", overflowWrap: "anywhere" }}>{message}</p>}
        {loading ? <p>Loading your goals...</p> : (
          <>
            <section style={{ ...card, marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 20 }}>
              <div><p style={{ color: "#b8b1d1" }}>Total Goals</p><h2>{goals.length}</h2></div>
              <div><p style={{ color: "#b8b1d1" }}>Completed</p><h2 style={{ color: "#6ce8d5" }}>{completed}</h2></div>
              <div><p style={{ color: "#b8b1d1" }}>Remaining</p><h2>{goals.length - completed}</h2></div>
              <div><p style={{ color: "#b8b1d1" }}>Overall Progress</p><h2 style={{ color: "#c4a6ff" }}>{progress}%</h2></div>
              <div style={{ gridColumn: "1 / -1", background: "#30284b", borderRadius: 20, height: 9, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#8956ff,#55e4e1)", transition: "width .3s" }} />
              </div>
            </section>

            <form onSubmit={addGoal} style={{ ...card, marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add your next goal..." aria-label="New goal"
                style={{ flex: "1 1 220px", minWidth: 0, padding: 14, borderRadius: 10, border: "1px solid #514078", background: "#0c0920", color: "white", outline: "none" }} />
              <button type="submit" disabled={saving} style={{ padding: "12px 22px", border: 0, borderRadius: 10, background: "linear-gradient(100deg,#8050f5,#5935dc)", color: "white", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Saving..." : "+ Add Goal"}
              </button>
            </form>

            <h2 style={{ marginTop: 30 }}>Your action plan</h2>
            {goals.length === 0 && <p>No goals yet. Add your first goal above!</p>}
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(245px,1fr))", gap: 16, marginTop: 16 }}>
              {goals.map((goal) => (
                <article key={goal.id} style={{ ...card, borderColor: goal.is_completed ? "#367c76" : "#514078", opacity: goal.is_completed ? 0.8 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#c4a6ff" }}>{goal.category}</span>
                    <span>{goal.is_completed ? "✅" : "✨"}</span>
                  </div>
                  <h3 style={{ textDecoration: goal.is_completed ? "line-through" : "none" }}>{goal.title}</h3>
                  <p style={{ color: "#b8b1d1", fontSize: 14 }}>{goal.target}</p>
                  <button type="button" onClick={() => toggleGoal(goal)} style={{ width: "100%", marginTop: 12, padding: 11, borderRadius: 10, border: "1px solid #7557bc", background: goal.is_completed ? "#193c3b" : "#33245b", color: "white", cursor: "pointer" }}>
                    {goal.is_completed ? "✓ Completed — Undo" : "Mark as completed"}
                  </button>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
