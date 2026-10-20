import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function PortfolioPreview() {
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;
      if (!data?.user) { window.location.href = "/login"; return; }
      setProfile(data.user.user_metadata || {});
      try {
        const read = key => {
          const value = JSON.parse(localStorage.getItem(key) || "[]");
          return Array.isArray(value) ? value : [];
        };
        setSkills(read("skill2project-skills"));
        setProjects(read("skill2project-own-projects"));
        setCertificates(read("skill2project-certificates"));
      } catch {}
      setLoading(false);
    }
    load();
    return () => { alive = false; };
  }, []);

  const panel = { padding: 22, borderRadius: 18, border: "1px solid #594477", background: "#17112e", marginTop: 18 };

  if (loading) return <main style={{ color: "white", background: "#08051c", minHeight: "100vh", padding: 30 }}>
<button
  type="button"
  onClick={() => { window.location.href = "/dashboard"; }}
  style={{
    background: "transparent",
    color: "#c4a6ff",
    border: "1px solid #7557bc",
    borderRadius: 10,
    padding: "10px 16px",
    marginBottom: 20,
    cursor: "pointer",
    fontWeight: 600
  }}
>
  ← Back to Dashboard
</button>Loading portfolio...</main>;

  return <main style={{ minHeight: "100vh", padding: "35px 20px", background: "radial-gradient(ellipse at top,#25125b,#08051c 70%)", color: "#f7f5ff", fontFamily: "Inter,system-ui,sans-serif" }}>
<button
  type="button"
  onClick={() => { window.location.href = "/dashboard"; }}
  style={{
    background: "transparent",
    color: "#c4a6ff",
    border: "1px solid #7557bc",
    borderRadius: 10,
    padding: "10px 16px",
    marginBottom: 20,
    cursor: "pointer",
    fontWeight: 600
  }}
>
  ← Back to Dashboard
</button>
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <Link to="/profile" style={{ color: "#c4b5fd" }}>← Back to My Profile</Link>
      <header style={{ ...panel, padding: 30 }}>
        <div style={{ fontSize: 42 }}>👤</div>
        <h1 style={{ fontSize: 34, margin: "10px 0" }}>{profile.full_name || "Student Name"}</h1>
        <h3 style={{ color: "#c4b5fd", margin: 0 }}>{profile.target_role || "Aspiring Developer"}</h3>
        <p style={{ color: "#d4c8f4" }}>{[profile.college, profile.branch, profile.study_year].filter(Boolean).join(" · ") || "Add your college and study details in My Profile."}</p>
        <p style={{ lineHeight: 1.7 }}>{profile.bio || "A motivated student building skills through hands-on projects."}</p>
      </header>
      <section style={panel}>
        <h2>💻 Skills ({skills.length})</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {skills.map((skill, i) => <span key={i} style={{ background: "#33205a", padding: "8px 13px", borderRadius: 20 }}>{typeof skill === "string" ? skill : skill.name || "Skill"}</span>)}
          {!skills.length && <p>Add skills from your Skills page.</p>}
        </div>
      </section>
      <section style={panel}>
        <h2>🚀 Projects ({projects.length})</h2>
        {projects.map((p, i) => <article key={p.id || i} style={{ borderTop: "1px solid #594477", padding: "12px 0" }}>
          <h3>{p.title || "Untitled project"}</h3><p>{p.description || "Project description not added."}</p>
          {p.technologies && <p>Stack: {p.technologies}</p>}
          {p.status && <p>Status: {p.status}</p>}
          {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ color: "#c4b5fd", marginRight: 15 }}>GitHub ↗</a>}
          {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer" style={{ color: "#86efac" }}>Live Demo ↗</a>}
        </article>)}
        {!projects.length && <p>Add your own projects from Explore Projects.</p>}
      </section>
      <section style={panel}>
        <h2>🏆 Certificates & Achievements ({certificates.length})</h2>
        {certificates.map((c, i) => <article key={c.id || i} style={{ borderTop: "1px solid #594477", padding: "12px 0" }}>
          <h3>{c.title}</h3>
          {c.issuer && <p>{c.issuer}</p>}
          {c.date && <p>{c.date}</p>}
          {c.url && <a href={c.url} target="_blank" rel="noreferrer" style={{ color: "#86efac" }}>View Certificate ↗</a>}
        </article>)}
        {!certificates.length && <p>Add certificates from My Profile.</p>}
      </section>
      <p style={{ color: "#a99acb", textAlign: "center", marginTop: 25 }}>Created with Skill2Project</p>
    </div>
  </main>;
}

