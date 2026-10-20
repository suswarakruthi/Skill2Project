import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const STORAGE_KEY = "skill2project-skills";
const starterSkills = ["React", "Python", "JavaScript", "HTML/CSS"];

function readSkills() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : starterSkills;
  } catch {
    return starterSkills;
  }
}

export default function Skills() {
  const [skills, setSkills] = useState(readSkills);
  const [skillInput, setSkillInput] = useState("");
  const [notice, setNotice] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUserSkills() {
      try {
        const { data: { session }, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!active) return;

        if (!session?.user) {
          setUserId(null);
          setNotice("Log in to sync your skills with your account.");
          return;
        }

        const uid = session.user.id;
        setUserId(uid);

        const { data, error } = await supabase
          .from("student_skills")
          .select("name")
          .eq("user_id", uid)
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (!active) return;

        if (data.length > 0) {
          const names = data.map((item) => item.name);
          setSkills(names);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
        } else {
          const localSkills = readSkills();
          const uniqueSkills = [...new Set(localSkills)];

          if (uniqueSkills.length > 0) {
            const { error: insertError } = await supabase
              .from("student_skills")
              .insert(uniqueSkills.map((name) => ({
                user_id: uid,
                name,
                level: "Beginner",
              })));

            if (insertError) throw insertError;
          }

          if (!active) return;
          setSkills(uniqueSkills);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueSkills));
        }

        setNotice("Your skills are synced with Supabase.");
      } catch (error) {
        if (active) {
          setNotice("Could not sync skills: " + error.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUserSkills();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUserSkills();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function addSkill(event) {
    event.preventDefault();
    const name = skillInput.trim();
    if (!name || saving) return;

    if (skills.some((skill) => skill.toLowerCase() === name.toLowerCase())) {
      setNotice("This skill is already in your list.");
      return;
    }

    setSaving(true);

    try {
      if (userId) {
        const { error } = await supabase.from("student_skills").insert({
          user_id: userId,
          name,
          level: "Beginner",
        });
        if (error) throw error;
      }

      const next = [...skills, name];
      setSkills(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSkillInput("");
      setNotice(userId
        ? "Skill saved to your Supabase account."
        : "Skill saved in this browser. Log in to sync it with Supabase.");
    } catch (error) {
      setNotice("Could not save skill: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeSkill(name) {
    if (saving) return;
    setSaving(true);

    try {
      if (userId) {
        const { error } = await supabase
          .from("student_skills")
          .delete()
          .eq("user_id", userId)
          .eq("name", name);

        if (error) throw error;
      }

      const next = skills.filter((skill) => skill !== name);
      setSkills(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setNotice(userId ? "Skill removed from your account." : "Skill removed.");
    } catch (error) {
      setNotice("Could not remove skill: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  const panel = {
    background: "rgba(30,20,57,.82)",
    border: "1px solid rgba(180,140,255,.25)",
    borderRadius: 22,
    padding: 24,
  };

  const button = {
    background: "linear-gradient(135deg,#8755f5,#6037bd)",
    color: "#fff",
    border: "1px solid rgba(190,160,255,.35)",
    borderRadius: 12,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: saving ? "wait" : "pointer",
    opacity: saving ? 0.7 : 1,
  };

  return (
    <main style={{
      minHeight: "100vh",
      padding: "36px 24px 64px",
      background: "radial-gradient(ellipse at top,#25134d 0%,#100923 48%,#080511 100%)",
      color: "#f7f3ff",
      fontFamily: "Inter, Segoe UI, sans-serif",
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <a href="/dashboard" style={{ color: "#bba0ff", textDecoration: "none" }}>
          {"<- Back to Dashboard"}
        </a>

        <header style={{ margin: "30px 0 26px" }}>
          <div style={{ color: "#bba0ff", fontSize: 12, fontWeight: 800, letterSpacing: 3 }}>
            SKILL2PROJECT / MY LEARNING
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,48px)", margin: "12px 0" }}>
            My Skills
          </h1>
          <p style={{ color: "#c5b8df", lineHeight: 1.7, maxWidth: 680 }}>
            Add the technologies you know. Skill2Project will use them to recommend
            projects, calculate your skill match, and show what you can learn next.
          </p>
        </header>

        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>Build your skill profile</h2>
          <p style={{ color: "#b7a9d5", fontSize: 14 }}>
            Add a skill you already know or are currently learning.
          </p>

          <form onSubmit={addSkill} style={{
            display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20,
          }}>
            <input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              placeholder="Example: Java, Flutter, SQL"
              aria-label="New skill"
              style={{
                flex: "1 1 250px", minWidth: 0, padding: 14,
                borderRadius: 12, border: "1px solid #594477",
                background: "#100923", color: "#fff", fontSize: 15,
              }}
            />
            <button type="submit" disabled={saving || loading} style={button}>
              {saving ? "Saving..." : "+ Add skill"}
            </button>
          </form>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22,
          }}>
            {skills.map((skill) => (
              <span key={skill} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 30,
                background: "rgba(135,85,245,.18)",
                border: "1px solid #7650b7", color: "#eee5ff",
              }}>
                {skill}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  title={`Remove ${skill}`}
                  style={{
                    border: 0, background: "transparent",
                    color: "#d7c2ff", cursor: "pointer", fontSize: 16,
                  }}
                >
                  x
                </button>
              </span>
            ))}
            {!loading && skills.length === 0 && (
              <p style={{ color: "#b7a9d5" }}>No skills added yet. Add your first skill above.</p>
            )}
          </div>

          <p aria-live="polite" style={{
            color: "#79e6dc", fontSize: 13, marginBottom: 0, overflowWrap: "anywhere",
          }}>
            {loading ? "Loading your skills..." : notice}
          </p>
        </section>

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16, marginTop: 20,
        }}>
          <article style={panel}>
            <div style={{ color: "#bba0ff", fontSize: 13 }}>YOUR SKILL PROFILE</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 10 }}>{skills.length}</div>
            <p style={{ color: "#b7a9d5", marginBottom: 0 }}>Skills in your list</p>
          </article>
          <article style={panel}>
            <div style={{ color: "#bba0ff", fontSize: 13 }}>NEXT STEP</div>
            <h3>Find your best-fit project</h3>
            <p style={{ color: "#b7a9d5", lineHeight: 1.6 }}>
              Compare your skills with project requirements and discover what to learn next.
            </p>
            <a href="/projects" style={{ ...button, display: "inline-block", textDecoration: "none" }}>
              Explore Projects
            </a>
          </article>
        </section>
      </div>
    </main>
  );
}
