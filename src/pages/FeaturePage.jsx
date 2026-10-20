import { Link, useLocation } from "react-router-dom";

const pageInfo = {
  "/mentor": {
    title: "AI Project Mentor",
    subtitle: "Get guidance to turn your skills into real projects.",
    icon: "🤖",
    features: ["Ask project-related questions", "Explore suitable technologies", "Plan your next project"]
  },
  "/skills": {
    title: "My Skills",
    subtitle: "Explore and manage the technologies you are learning.",
    icon: "💡",
    features: ["Add your technical skills", "Track skills you are learning", "Find skills to learn next"]
  },
  "/projects": {
    title: "Explore Projects",
    subtitle: "Discover project ideas that match your interests.",
    icon: "🚀",
    features: ["Browse project ideas", "Explore technology stacks", "Choose a project difficulty"]
  },
  "/certificates": {
    title: "Certificates & Achievements",
    subtitle: "Keep your learning achievements organized.",
    icon: "🏆",
    features: ["Organize certificates", "Track completed courses", "Showcase achievements"]
  },
  "/community": {
    title: "Student Community",
    subtitle: "Connect with ideas, collaboration and learning.",
    icon: "👥",
    features: ["Discover collaboration ideas", "Share project concepts", "Learn with fellow students"]
  },
  "/roadmap": {
    title: "Learning Roadmap",
    subtitle: "Follow a clear path from learning to building.",
    icon: "📈",
    features: ["Choose a learning goal", "Break it into milestones", "Track your progress"]
  }
};

export default function FeaturePage() {
  const { pathname } = useLocation();
  const page = pageInfo[pathname] || pageInfo["/projects"];

  return (
    <main style={{
      minHeight: "100vh",
      padding: "48px 24px",
      color: "#f7f5ff",
      background: "radial-gradient(ellipse at top, #241454, #08051c 65%)",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link to="/dashboard" style={{
          color: "#b8a5ff", textDecoration: "none"
        }}>
          ← Back to Dashboard
        </Link>

        <section style={{
          marginTop: 30, padding: 32, borderRadius: 24,
          border: "1px solid #9d8aff50",
          background: "#15112de8"
        }}>
          <div style={{ fontSize: 48 }}>{page.icon}</div>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>{page.title}</h1>
          <p style={{ color: "#bcb5d8", lineHeight: 1.7 }}>
            {page.subtitle}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16, marginTop: 28
          }}>
            {page.features.map((feature) => (
              <article key={feature} style={{
                padding: 22, borderRadius: 16,
                border: "1px solid #ffffff20",
                background: "#ffffff08"
              }}>
                <h3 style={{ fontSize: 16 }}>✦ {feature}</h3>
                <p style={{ color: "#aaa6c7", fontSize: 13 }}>
                  Your learning journey starts here.
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
