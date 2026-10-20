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

export default function Profile() {
  const [form, setForm] = useState(emptyProfile);
  const [email, setEmail] = useState("");
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

  if (loading) {
    return <main style={{ minHeight: "100vh", background: "#08051c", color: "#fff", padding: 40 }}>Loading profile...</main>;
  }

  return (
    <main style={{
      minHeight: "100vh", padding: "36px 20px",
      background: "radial-gradient(ellipse at top, #25125b, #08051c 65%)",
      color: "#f7f5ff", fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <Link to="/dashboard" style={{ color: "#c4b5fd", textDecoration: "none" }}>← Back to Dashboard</Link>
        <section style={{
          marginTop: 24, padding: 28, borderRadius: 22,
          border: "1px solid #594477", background: "#17112ee8"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
            <div style={{
              width: 76, height: 76, borderRadius: "50%", display: "grid",
              placeItems: "center", fontSize: 34,
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
      </div>
    </main>
  );
}
