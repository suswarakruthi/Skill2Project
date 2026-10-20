import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const emptyProfile = {
  full_name: "",
  college: "",
  branch: "",
  study_year: "",
  target_role: "",
  bio: ""
};

function readLocalArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function CertificateManager() {
  const key = "skill2project-certificates";
  const [items, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");

  function add(event) {
    event.preventDefault();
    if (!title.trim()) return;
    const next = [{ id: String(Date.now()), title: title.trim(), issuer, date, url }, ...items];
    localStorage.setItem(key, JSON.stringify(next));
    setItems(next);
    setTitle(""); setIssuer(""); setDate(""); setUrl("");
  }

  const field = {
    padding: 12, borderRadius: 9, border: "1px solid #594477",
    background: "#100923", color: "#fff", width: "100%",
    boxSizing: "border-box", font: "inherit"
  };

  return <div>
    <form onSubmit={add} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
      <input required placeholder="Certificate / achievement name *" value={title} onChange={e => setTitle(e.target.value)} style={field} />
      <input placeholder="Issuing organization" value={issuer} onChange={e => setIssuer(e.target.value)} style={field} />
      <input type="date" aria-label="Issue date" value={date} onChange={e => setDate(e.target.value)} style={field} />
      <input type="url" placeholder="Certificate URL (optional)" value={url} onChange={e => setUrl(e.target.value)} style={field} />
      <button type="submit" style={{ padding: 12, border: 0, borderRadius: 24, background: "linear-gradient(100deg,#7850f5,#6039df)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>+ Add Achievement</button>
    </form>
    <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
      {!items.length && <p style={{ color: "#bdb4da" }}>No certificates yet. Add your first achievement above.</p>}
      {items.map(item => <article key={item.id} style={{ padding: 16, borderRadius: 13, border: "1px solid #594477", background: "#100923" }}>
        <h3>{item.title}</h3>
        {item.issuer && <p>Issued by: {item.issuer}</p>}
        {item.date && <p style={{ color: "#bdb4da" }}>Date: {item.date}</p>}
        {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#86efac" }}>View Certificate ↗</a>}
        <button type="button" onClick={() => {
          if (window.confirm("Delete this achievement?")) {
            const next = items.filter(x => x.id !== item.id);
            localStorage.setItem(key, JSON.stringify(next));
            setItems(next);
          }
        }} style={{ marginLeft: 14, border: 0, background: "transparent", color: "#fda4af", cursor: "pointer" }}>Delete</button>
      </article>)}
    </div>
  </div>;
}
export default function Profile() {
  const [form, setForm] = useState(emptyProfile);
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();
      if (!alive) return;

      if (error || !data.user) {
        window.location.href = "/login";
        return;
      }

      const user = data.user;
      setEmail(user.email || "");
      setForm({ ...emptyProfile, ...(user.user_metadata || {}) });
      setSkills(readLocalArray("skill2project-skills"));
      setProjects(readLocalArray("skill2project-own-projects"));
      setLoading(false);
    }

    loadProfile();
    return () => { alive = false; };
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    const { error } = await supabase.auth.updateUser({ data: form });
    setSaving(false);
    setNotice(error ? "Could not save profile. Please try again." : "Profile saved successfully!");
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: "1px solid #594477", background: "#100923", color: "#fff",
    font: "inherit", boxSizing: "border-box"
  };

  const panelStyle = {
    marginTop: 20, padding: 24, borderRadius: 20,
    border: "1px solid #594477", background: "#17112ee8"
  };

  if (loading) {
    return <main style={{ minHeight: "100vh", background: "#08051c", color: "#fff", padding: 40 }}>Loading profile...</main>;
  }

  return (
    <main style={{
      minHeight: "100vh", padding: "36px 20px",
      background: "radial-gradient(ellipse at top, #25125b, #08051c 65%)",
      color: "#f7f5ff", fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link to="/dashboard" style={{ color: "#c4b5fd", textDecoration: "none" }}>← Back to Dashboard</Link>

        <section style={{ ...panelStyle, marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
            <div style={{
              width: 76, height: 76, borderRadius: "50%", display: "grid",
              placeItems: "center", fontSize: 34, flexShrink: 0,
              background: "linear-gradient(135deg,#edb8ff,#7167ff)"
            }}>👤</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 30 }}>My Profile</h1>
              <p style={{ color: "#bdb4da", margin: "7px 0 0" }}>Your student details and career goals</p>
            </div>
          </div>

          <p style={{ color: "#c4b5fd", overflowWrap: "anywhere" }}>Account: {email}</p>

          <form onSubmit={saveProfile} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
            {[
              ["full_name", "Full name", "Your name"],
              ["college", "College", "College or university"],
              ["branch", "Branch / Department", "e.g. Information Technology"],
              ["study_year", "Year of study", "e.g. 3rd Year"],
              ["target_role", "Target job role", "e.g. Software Engineer"]
            ].map(([name, label, placeholder]) => (
              <label key={name} style={{ display: "grid", gap: 8, color: "#e6ddff", fontSize: 14 }}>
                {label}
                <input name={name} value={form[name] || ""} onChange={updateField} placeholder={placeholder} style={inputStyle} />
              </label>
            ))}

            <label style={{ gridColumn: "1 / -1", display: "grid", gap: 8, color: "#e6ddff", fontSize: 14 }}>
              Short bio
              <textarea name="bio" value={form.bio || ""} onChange={updateField} placeholder="Tell us about yourself and what you want to build..." rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <button type="submit" disabled={saving} style={{
                border: 0, borderRadius: 24, padding: "13px 22px",
                color: "#fff", fontWeight: 700, cursor: saving ? "wait" : "pointer",
                background: "linear-gradient(100deg,#7850f5,#6039df)"
              }}>{saving ? "Saving..." : "Save Profile"}</button>
              {notice && <span role="status" style={{ color: notice.startsWith("Profile saved") ? "#86efac" : "#fda4af" }}>{notice}</span>}
            </div>
          </form>
        </section>

        <section style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>🌟 Portfolio Preview</h2>
          <p style={{ color: "#bdb4da" }}>Preview how your student profile, skills, projects and achievements look together.</p>
          <button type="button" onClick={() => window.open("/portfolio-preview", "_blank")} style={{ border: 0, borderRadius: 24, padding: "12px 20px", color: "#fff", fontWeight: 700, cursor: "pointer", background: "linear-gradient(100deg,#7850f5,#6039df)" }}>
            Preview My Portfolio ↗
          </button>
        </section>
        <section style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>💻 My Skills <span style={{ color: "#bdb4da", fontSize: 14 }}>({skills.length})</span></h2>
          {skills.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {skills.map((skill, index) => (
                <span key={`${skill}-${index}`} style={{
                  padding: "9px 14px", borderRadius: 20,
                  background: "#33205a", border: "1px solid #7757b5", color: "#e6ddff"
                }}>{typeof skill === "string" ? skill : skill.name || JSON.stringify(skill)}</span>
              ))}
            </div>
          ) : (
            <p style={{ color: "#bdb4da" }}>No skills added yet. Visit the Skills page to add your technologies.</p>
          )}
          <Link to="/skills" style={{ display: "inline-block", marginTop: 18, color: "#c4b5fd" }}>Manage Skills →</Link>
        </section>

        <section style={panelStyle}>
                  <section style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>🏆 My Certificates & Achievements</h2>
          <CertificateManager />
        </section>
<h2 style={{ marginTop: 0 }}>🚀 My Projects <span style={{ color: "#bdb4da", fontSize: 14 }}>({projects.length})</span></h2>
          {projects.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
              {projects.map((project, index) => (
                <article key={project.id || `${project.title}-${index}`} style={{
                  padding: 18, borderRadius: 14, border: "1px solid #594477",
                  background: "#100923", minWidth: 0
                }}>
                  <h3 style={{ margin: "0 0 10px", overflowWrap: "anywhere" }}>{project.title || "Untitled project"}</h3>
                  <p style={{ color: "#bdb4da", fontSize: 14, lineHeight: 1.6 }}>
                    {project.description || "No description added yet."}
                  </p>
                  {project.technologies && <p style={{ fontSize: 13, overflowWrap: "anywhere" }}><strong>Stack:</strong> {project.technologies}</p>}
                  {project.status && <p style={{ fontSize: 13 }}><strong>Status:</strong> {project.status}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ color: "#c4b5fd" }}>GitHub ↗</a>}
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" style={{ color: "#86efac" }}>Live Demo ↗</a>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: "#bdb4da" }}>No personal projects yet. Add a project from Explore Projects.</p>
          )}
          <Link to="/projects" style={{ display: "inline-block", marginTop: 18, color: "#c4b5fd" }}>Explore Projects →</Link>
        </section>
      </div>
    </main>
  );
}


