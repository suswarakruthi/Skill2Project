import { useMemo, useState } from "react";

const projectCatalog = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    category: "Web Development",
    level: "Beginner",
    skills: ["HTML/CSS", "JavaScript", "React"],
    description: "Build a professional portfolio to showcase your skills and projects.",
    stack: "HTML, CSS, JavaScript, React",
    duration: "3-5 days",
  },
  {
    id: 2,
    title: "Student Task Manager",
    category: "Web Development",
    level: "Beginner",
    skills: ["React", "JavaScript", "HTML/CSS"],
    description: "Create a task tracker with priorities, deadlines and progress.",
    stack: "React, JavaScript, CSS",
    duration: "5-7 days",
  },
  {
    id: 3,
    title: "Expense Tracker",
    category: "Python Development",
    level: "Intermediate",
    skills: ["Python", "SQL", "JavaScript"],
    description: "Track expenses, organize spending and display monthly summaries.",
    stack: "Python, SQL, JavaScript",
    duration: "1-2 weeks",
  },
  {
    id: 4,
    title: "AI Interview Preparation App",
    category: "AI & Web",
    level: "Intermediate",
    skills: ["Python", "React", "JavaScript"],
    description: "Build an interview practice dashboard with questions and feedback.",
    stack: "React, Python, API integration",
    duration: "2-3 weeks",
  },
  {
    id: 5,
    title: "Campus Connect",
    category: "Full Stack",
    level: "Advanced",
    skills: ["React", "Python", "SQL"],
    description: "Create a campus platform for student events and collaboration.",
    stack: "React, Python, SQL",
    duration: "3-4 weeks",
  },
  {
    id: 6,
    title: "Flutter Student Companion",
    category: "Mobile Development",
    level: "Intermediate",
    skills: ["Flutter", "Dart", "SQL"],
    description: "Build a student app for notes, schedules and study progress.",
    stack: "Flutter, Dart, SQL",
    duration: "2-3 weeks",
  },
];

const starterSkills = ["React", "Python", "JavaScript", "HTML/CSS"];

const styles = {
  page: {
    minHeight: "100vh",
    padding: "36px 24px 60px",
    background: "radial-gradient(ellipse at top, #25134d 0%, #100923 48%, #080511 100%)",
    color: "#f4efff",
    fontFamily: "Inter, Segoe UI, sans-serif",
  },
  container: { maxWidth: 1120, margin: "0 auto" },
  muted: { color: "#b7a9d5", lineHeight: 1.65 },
  panel: {
    background: "rgba(30, 20, 57, 0.78)",
    border: "1px solid rgba(180, 140, 255, 0.22)",
    borderRadius: 20,
    padding: 22,
  },
  button: {
    border: "1px solid rgba(190, 150, 255, .45)",
    borderRadius: 12,
    padding: "10px 15px",
    background: "linear-gradient(135deg, #8755f5, #6037bd)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondary: {
    border: "1px solid #594477",
    borderRadius: 10,
    padding: "9px 12px",
    background: "#211536",
    color: "#eee4ff",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#130d24",
    border: "1px solid #594477",
    borderRadius: 10,
    padding: 12,
    color: "white",
    outline: "none",
  },
};

function readSavedSkills() {
  try {
    const saved = JSON.parse(localStorage.getItem("skill2project-skills"));
    return Array.isArray(saved) ? saved : starterSkills;
  } catch {
    return starterSkills;
  }
}

function getMatch(project, skills) {
  const normalized = skills.map((skill) => skill.trim().toLowerCase());
  const matched = project.skills.filter((skill) =>
    normalized.includes(skill.toLowerCase())
  );
  const missing = project.skills.filter((skill) =>
    !normalized.includes(skill.toLowerCase())
  );
  return {
    matched,
    missing,
    percentage: Math.round((matched.length / project.skills.length) * 100),
  };
}

export default function ExploreProjects() {
  const [skills, setSkills] = useState(readSavedSkills);
  const [skillInput, setSkillInput] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [selected, setSelected] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  function saveSkills(nextSkills) {
    setSkills(nextSkills);
    try {
      localStorage.setItem("skill2project-skills", JSON.stringify(nextSkills));
    } catch {
      // The page can still work if browser storage is unavailable.
    }
  }

  function addSkill(event) {
    event.preventDefault();
    const value = skillInput.trim();
    if (!value) return;
    if (skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }
    saveSkills([...skills, value]);
    setSkillInput("");
  }

  const recommendations = useMemo(() => {
    return projectCatalog
      .map((project) => ({ ...project, ...getMatch(project, skills) }))
      .filter((project) =>
        (project.title + " " + project.category + " " + project.skills.join(" "))
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((project) => level === "All" || project.level === level)
      .sort((a, b) => b.percentage - a.percentage);
  }, [skills, search, level]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <a href="/dashboard" style={{ color: "#cbb5ff", textDecoration: "none" }}>
          {"<-"} Back to Dashboard
        </a>

        <header style={{ margin: "28px 0 30px" }}>
          <p style={{ color: "#bd9bff", letterSpacing: 3, fontSize: 12, fontWeight: 800 }}>
            SKILL2PROJECT / DISCOVER
          </p>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "8px 0" }}>
            Find projects that fit your skills.
          </h1>
          <p style={styles.muted}>
            Discover project ideas, check your skill-match percentage and identify what to learn next.
          </p>
        </header>

        <section style={{ ...styles.panel, marginBottom: 26 }}>
          <h2 style={{ marginTop: 0 }}>Your current skills</h2>
          <p style={styles.muted}>Add the technologies you already know. Recommendations update automatically.</p>
          <form onSubmit={addSkill} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              aria-label="Add a skill"
              style={{ ...styles.input, flex: "1 1 220px" }}
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              placeholder="Example: Java, Flutter, SQL"
            />
            <button type="submit" style={styles.button}>+ Add skill</button>
          </form>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 17 }}>
            {skills.map((skill) => (
              <span key={skill} style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                padding: "8px 11px", borderRadius: 30,
                background: "rgba(139, 92, 246, .18)",
                border: "1px solid #7050a0", color: "#eee3ff",
              }}>
                {skill}
                <button
                  type="button"
                  aria-label={"Remove " + skill}
                  onClick={() => saveSkills(skills.filter((item) => item !== skill))}
                  style={{ border: 0, background: "transparent", color: "#f3b6d5", cursor: "pointer" }}
                >x</button>
              </span>
            ))}
            {skills.length === 0 && <p style={styles.muted}>Add a skill to start matching projects.</p>}
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "end", marginBottom: 18 }}>
          <div>
            <h2 style={{ marginBottom: 5 }}>Recommended projects</h2>
            <p style={styles.muted}>{recommendations.length} project ideas ranked by skill match.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              aria-label="Search projects"
              style={{ ...styles.input, width: 210 }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
            />
            <select
              aria-label="Filter by difficulty"
              style={{ ...styles.input, width: 160 }}
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="All">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 18 }}>
          {recommendations.map((project) => (
            <article key={project.id} style={{ ...styles.panel, display: "flex", flexDirection: "column", gap: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                <span style={{ color: "#cbb4ff", fontSize: 12 }}>{project.category}</span>
                <span style={{ border: "1px solid #60458a", borderRadius: 20, padding: "5px 9px", fontSize: 12 }}>
                  {project.level}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: 21 }}>{project.title}</h3>
              <p style={{ ...styles.muted, margin: 0 }}>{project.description}</p>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
                  <span>Skill match</span>
                  <strong style={{ color: "#c9a8ff" }}>{project.percentage}%</strong>
                </div>
                <div style={{ height: 8, background: "#302244", borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: project.percentage + "%", background: "linear-gradient(90deg, #8b5cf6, #41d9e8)", borderRadius: 20 }} />
                </div>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                <div><strong>Matched:</strong> {project.matched.join(", ") || "None yet"}</div>
                <div><strong>To learn:</strong> {project.missing.join(", ") || "All required skills matched!"}</div>
                <div><strong>Estimated time:</strong> {project.duration}</div>
              </div>

              <button type="button" style={styles.button} onClick={() => setSelected(selected === project.id ? null : project.id)}>
                {selected === project.id ? "Hide project plan" : "View project plan"}
              </button>

              {selected === project.id && (
                <div style={{ borderTop: "1px solid #594477", paddingTop: 13 }}>
                  <p><strong>Suggested stack</strong></p>
                  <p style={styles.muted}>{project.stack}</p>
                  <p><strong>Build roadmap</strong></p>
                  <ol style={{ ...styles.muted, paddingLeft: 20 }}>
                    <li>Review the required skills and set up your project.</li>
                    <li>Build the main interface and core features.</li>
                    <li>Test the features and fix errors.</li>
                    <li>Write a README and publish your finished project.</li>
                  </ol>
                  <button
                    type="button"
                    style={styles.secondary}
                    onClick={() => setSavedIds((ids) => ids.includes(project.id) ? ids.filter((id) => id !== project.id) : [...ids, project.id])}
                  >
                    {savedIds.includes(project.id) ? "Saved to my list" : "Save project"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        {recommendations.length === 0 && (
          <section style={styles.panel}>
            No projects match these filters. Try another search or difficulty level.
          </section>
        )}

        <p style={{ ...styles.muted, fontSize: 12, marginTop: 26 }}>
          These are rule-based demo recommendations using your browser-saved skills. Cloud sync and AI-generated recommendations can be added next.
        </p>
      </div>
    </main>
  );
}
