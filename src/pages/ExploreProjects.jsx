import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

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

const ownInputStyle = {
  width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 10,
  border: "1px solid #594477", background: "#100923", color: "#fff", font: "inherit"
};

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
  const [ownProjects, setOwnProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem("skill2project-own-projects") || "[]"); }
    catch { return []; }
  });
  const [showOwnForm, setShowOwnForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [cloudMessage, setCloudMessage] = useState("");
  useEffect(() => {
    let active = true;

    async function loadCloudData() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        if (active) setCloudMessage("Sign in to sync your projects and skills across devices.");
        return;
      }

      if (!active) return;
      setCurrentUserId(user.id);

      const { data: skillRows, error: skillsError } = await supabase
        .from("student_skills")
        .select("name")
        .eq("user_id", user.id);

      if (skillsError) {
        if (active) setCloudMessage("Could not load cloud skills. Please refresh and try again.");
      } else if (active && skillRows?.length) {
        const cloudSkills = [...new Set(skillRows.map((row) => row.name).filter(Boolean))];
        setSkills(cloudSkills);
        localStorage.setItem("skill2project-skills", JSON.stringify(cloudSkills));
      }

      const { data: projectRows, error: projectsError } = await supabase
        .from("student_projects")
        .select("id,title,description,stack,github,demo,status,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (projectsError) {
        if (active) setCloudMessage("Could not load your cloud projects. Check the Supabase table columns.");
        return;
      }

      if (!active) return;

      if (projectRows?.length) {
        const mapped = projectRows.map((row) => ({
          id: row.id,
          title: row.title || "",
          description: row.description || "",
          stack: row.stack || "",
          github: row.github || "",
          demo: row.demo || "",
          status: row.status || "Planning",
        }));
        setOwnProjects(mapped);
        localStorage.setItem("skill2project-own-projects", JSON.stringify(mapped));
      } else {
        const localProjects = JSON.parse(localStorage.getItem("skill2project-own-projects") || "[]");
        for (const project of localProjects) {
          const { error } = await supabase.from("student_projects").insert({
            user_id: user.id,
            title: project.title || "Untitled project",
            description: project.description || "",
            stack: project.stack || "",
            github: project.github || "",
            demo: project.demo || "",
            status: project.status || "Planning",
          });
          if (error) {
            if (active) setCloudMessage("Cloud sync couldn't import your older projects. You can still add projects.");
            return;
          }
        }

        const { data: migratedRows, error: migratedError } = await supabase
          .from("student_projects")
          .select("id,title,description,stack,github,demo,status,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!migratedError && active && migratedRows) {
          const mapped = migratedRows.map((row) => ({
            id: row.id,
            title: row.title || "",
            description: row.description || "",
            stack: row.stack || "",
            github: row.github || "",
            demo: row.demo || "",
            status: row.status || "Planning",
          }));
          setOwnProjects(mapped);
          localStorage.setItem("skill2project-own-projects", JSON.stringify(mapped));
        }
      }

      if (active) setCloudMessage("Connected to Supabase — your projects and skills sync to your account.");
    }

    loadCloudData().catch(() => {
      if (active) setCloudMessage("Cloud sync failed. Your browser-saved data is still available.");
    });

    return () => { active = false; };
  }, []);
  const [editingOwnId, setEditingOwnId] = useState(null);
  const [ownForm, setOwnForm] = useState({
    title: "", description: "", stack: "", github: "", demo: "", status: "Planning"
  });

  async function persistOwnProjects(next) {
    setOwnProjects(next);
    localStorage.setItem("skill2project-own-projects", JSON.stringify(next));
  }

  async function submitOwnProject(event) {
    event.preventDefault();
    const title = ownForm.title.trim();
    if (!title) return;

    const payload = {
      title,
      description: ownForm.description || "",
      stack: ownForm.stack || "",
      github: ownForm.github || "",
      demo: ownForm.demo || "",
      status: ownForm.status || "Planning",
    };

    if (currentUserId) {
      const result = editingOwnId
        ? await supabase.from("student_projects").update(payload).eq("id", editingOwnId).eq("user_id", currentUserId)
        : await supabase.from("student_projects").insert({ ...payload, user_id: currentUserId });

      if (result.error) {
        setCloudMessage("Project save failed: " + result.error.message);
        return;
      }

      const { data, error } = await supabase
        .from("student_projects")
        .select("id,title,description,stack,github,demo,status,created_at")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        setCloudMessage("Saved, but couldn't refresh projects. Reload the page.");
        return;
      }

      const mapped = (data || []).map((row) => ({
        id: row.id, title: row.title || "", description: row.description || "",
        stack: row.stack || "", github: row.github || "", demo: row.demo || "",
        status: row.status || "Planning",
      }));
      setOwnProjects(mapped);
      localStorage.setItem("skill2project-own-projects", JSON.stringify(mapped));
      setCloudMessage("Project saved to Supabase successfully.");
    } else {
      const item = { ...payload, id: editingOwnId || Date.now() };
      const next = editingOwnId
        ? ownProjects.map((project) => project.id === editingOwnId ? item : project)
        : [item, ...ownProjects];
      await persistOwnProjects(next);
      setCloudMessage("Saved in this browser. Sign in to sync with Supabase.");
    }

    setOwnForm({ title: "", description: "", stack: "", github: "", demo: "", status: "Planning" });
    setEditingOwnId(null);
    setShowOwnForm(false);
  }

  async function deleteOwnProject(projectId) {
    if (currentUserId) {
      const { error } = await supabase
        .from("student_projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", currentUserId);

      if (error) {
        setCloudMessage("Project delete failed: " + error.message);
        return;
      }
    }

    const next = ownProjects.filter((project) => project.id !== projectId);
    await persistOwnProjects(next);
    setCloudMessage(currentUserId ? "Project deleted from Supabase." : "Project deleted from this browser.");
  }

  function editOwnProject(project) {
    setOwnForm({
      title: project.title || "", description: project.description || "",
      stack: project.stack || "", github: project.github || "",
      demo: project.demo || "", status: project.status || "Planning"
    });
    setEditingOwnId(project.id);
    setShowOwnForm(true);
  }

  async function saveSkills(nextSkills) {
    setSkills(nextSkills);
    localStorage.setItem("skill2project-skills", JSON.stringify(nextSkills));

    if (!currentUserId) {
      setCloudMessage("Skills saved in this browser. Sign in to sync with Supabase.");
      return;
    }

    const { data: existingRows, error: readError } = await supabase
      .from("student_skills")
      .select("id,name")
      .eq("user_id", currentUserId);

    if (readError) {
      setCloudMessage("Couldn't update cloud skills: " + readError.message);
      return;
    }

    const existingNames = new Set((existingRows || []).map((row) => row.name));
    const wantedNames = new Set(nextSkills);

    const toInsert = nextSkills
      .filter((name) => !existingNames.has(name))
      .map((name) => ({ user_id: currentUserId, name, level: "Beginner" }));

    const toDelete = (existingRows || []).filter((row) => !wantedNames.has(row.name));

    if (toInsert.length) {
      const { error } = await supabase.from("student_skills").insert(toInsert);
      if (error) {
        setCloudMessage("Couldn't save new cloud skills: " + error.message);
        return;
      }
    }

    for (const row of toDelete) {
      const { error } = await supabase
        .from("student_skills")
        .delete()
        .eq("id", row.id)
        .eq("user_id", currentUserId);

      if (error) {
        setCloudMessage("Couldn't remove a cloud skill: " + error.message);
        return;
      }
    }

    setCloudMessage("Skills synced with Supabase.");
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


        <section style={{ ...styles.panel, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: "0 0 6px" }}>Build your own project portfolio</h2>
              <p style={styles.muted}>Add projects you are planning, building, or have completed.</p>
            </div>
            <button type="button" style={styles.button} onClick={() => {
              setShowOwnForm((v) => !v);
              setEditingOwnId(null);
              setOwnForm({ title: "", description: "", stack: "", github: "", demo: "", status: "Planning" });
            }}>
              {showOwnForm ? "Close form" : "+ Add My Project"}
            </button>
          </div>

          {showOwnForm && (
            <form onSubmit={submitOwnProject} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 18 }}>
              <input required placeholder="Project title *" value={ownForm.title} onChange={(e) => setOwnForm({ ...ownForm, title: e.target.value })} style={ownInputStyle} />
              <input placeholder="Technologies (React, Python...)" value={ownForm.stack} onChange={(e) => setOwnForm({ ...ownForm, stack: e.target.value })} style={ownInputStyle} />
              <input placeholder="GitHub repository URL" value={ownForm.github} onChange={(e) => setOwnForm({ ...ownForm, github: e.target.value })} style={ownInputStyle} />
              <input placeholder="Live demo URL" value={ownForm.demo} onChange={(e) => setOwnForm({ ...ownForm, demo: e.target.value })} style={ownInputStyle} />
              <select value={ownForm.status} onChange={(e) => setOwnForm({ ...ownForm, status: e.target.value })} style={ownInputStyle}>
                <option>Planning</option><option>In Progress</option><option>Completed</option>
              </select>
              <textarea placeholder="What does your project do?" value={ownForm.description} onChange={(e) => setOwnForm({ ...ownForm, description: e.target.value })} style={{ ...ownInputStyle, minHeight: 76 }} />
              <button type="submit" style={styles.button}>{editingOwnId ? "Update Project" : "Save My Project"}</button>
            </form>
          )}

          <h3 style={{ marginTop: 26 }}>My Projects ({ownProjects.length})</h3>
          {cloudMessage && <p role="status" style={styles.muted}>{cloudMessage}</p>}
          {ownProjects.length === 0 ? (
            <p style={styles.muted}>No personal projects yet. Click ?Add My Project? to create your first one.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
              {ownProjects.map((project) => (
                <article key={project.id} style={{ ...styles.panel, padding: 18 }}>
                  <h3 style={{ marginTop: 0 }}>{project.title}</h3>
                  <p style={styles.muted}>{project.description || "No description added yet."}</p>
                  <p><strong>Stack:</strong> {project.stack || "Not specified"}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  {project.github && <p><a href={project.github} target="_blank" rel="noreferrer" style={{ color: "#cbb5ff" }}>GitHub repository</a></p>}
                  {project.demo && <p><a href={project.demo} target="_blank" rel="noreferrer" style={{ color: "#70e8f0" }}>Live demo</a></p>}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" style={styles.secondary} onClick={() => editOwnProject(project)}>Edit</button>
                    <button type="button" style={styles.secondary} onClick={() => {
                      if (window.confirm("Delete this project?")) deleteOwnProject(project.id);
                    }}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

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
                <div style={{ borderTop: "1px solid #594477", paddingTop: 16, marginTop: 12 }}>
                  <p><strong>Suggested stack</strong></p>
                  <p style={styles.muted}>{project.stack}</p>

                  <p><strong>Project build roadmap</strong></p>
                  <p style={styles.muted}>Follow these milestones in order. Tick each step when you finish it.</p>

                  <div style={{ height: 8, background: "#302244", borderRadius: 20, overflow: "hidden", margin: "10px 0" }}>
                    <div style={{
                      height: "100%",
                      width: ((JSON.parse(localStorage.getItem("skill2project-roadmap-" + project.id) || "[]").length / 5) * 100) + "%",
                      background: "linear-gradient(90deg, #8b5cf6, #41d9e8)",
                      transition: "width .2s ease"
                    }} />
                  </div>

                  <p style={styles.muted}>
                    {JSON.parse(localStorage.getItem("skill2project-roadmap-" + project.id) || "[]").length} of 5 milestones completed
                  </p>

                  {[
                    "Plan the features and sketch the screens.",
                    "Set up the project folder and required technologies.",
                    "Build the main interface and core functionality.",
                    "Test the project and fix errors.",
                    "Write a README, add screenshots and publish the project."
                  ].map((step, index) => {
                    const key = "skill2project-roadmap-" + project.id;
                    let completed = [];
                    try { completed = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
                    const checked = completed.includes(index);
                    return (
                      <label key={step} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "11px 0",
                        borderBottom: "1px solid rgba(180,140,255,.12)",
                        cursor: "pointer",
                        color: checked ? "#aaa0c5" : "#f4efff",
                        textDecoration: checked ? "line-through" : "none"
                      }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const latest = new Set(completed);
                            if (event.target.checked) latest.add(index);
                            else latest.delete(index);
                            localStorage.setItem(key, JSON.stringify([...latest]));
                            setSelected(null);
                            setTimeout(() => setSelected(project.id), 0);
                          }}
                          style={{ accentColor: "#9b70ff", marginTop: 4 }}
                        />
                        <span><strong>Step {index + 1}.</strong> {step}</span>
                      </label>
                    );
                  })}

                  <p><strong>Skills to focus on</strong></p>
                  <p style={styles.muted}>
                    {project.missing.length ? project.missing.join(", ") : "You have all the listed project skills. Focus on practice and implementation."}
                  </p>

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

