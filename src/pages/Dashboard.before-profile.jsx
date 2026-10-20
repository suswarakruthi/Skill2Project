import { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  { id: "home", label: "Home", icon: "\u{1F3E0}", angle: -90 },
  { id: "mentor", label: "AI Mentor", icon: "\u{1F52E}", angle: -38 },
  { id: "skills", label: "Skills & Technologies", icon: "\u{1F4BB}", angle: -142 },
  { id: "projects", label: "Explore Projects", icon: "\u{1F680}", angle: 0 },
  { id: "certificates", label: "Certificates & Achievements", icon: "\u{1F4DC}", angle: 180 },
  { id: "roadmap", label: "Learning Roadmap", icon: "\u{1F4C8}", angle: 38 },
  { id: "community", label: "Community", icon: "\u{1F465}", angle: 142 },
];

const initialSkills = ["React", "Python", "JavaScript", "HTML/CSS"];

function Dashboard() {
  const [active, setActive] = useState("home");
  const [skills, setSkills] = useState(initialSkills);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "AI Mentor",
      text: "Hi! Tell me what you want to build, and let's plan your next project.",
    },
  ]);

  const toggleSkill = (skill) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    setMessages((current) => [
      ...current,
      { from: "You", text: message.trim() },
      {
        from: "AI Mentor",
        text: "Great idea! Start by defining your project goal, choosing the technologies you need, and building a small working prototype. This demo mentor is not connected to an AI API yet.",
      },
    ]);
    setMessage("");
  };

  const openItem = (id) => {
    const routes = {
      home: "/dashboard",
      mentor: "/mentor",
      skills: "/skills",
      projects: "/projects",
      certificates: "/certificates",
      roadmap: "/roadmap",
      community: "/community",
    };
    const path = routes[id];
    if (path) window.location.href = path;
  };

  return (
    <div className="sp-dashboard">
      <style>{`
        .sp-dashboard {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          color: #f7f5ff;
          background:
            radial-gradient(ellipse at 50% 48%, #25125b 0%, transparent 48%),
            radial-gradient(ellipse at 15% 20%, #18265a 0%, transparent 38%),
            radial-gradient(ellipse at 85% 75%, #351052 0%, transparent 38%),
            linear-gradient(180deg, #03030f 0%, #08051c 55%, #100522 100%);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        .sp-dashboard::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background-image:
            radial-gradient(2px 2px at 10% 20%, #ffffff 50%, transparent),
            radial-gradient(1px 1px at 25% 70%, #83eaff 50%, transparent),
            radial-gradient(2px 2px at 78% 15%, #d9a7ff 50%, transparent),
            radial-gradient(1px 1px at 90% 60%, #ffffff 50%, transparent),
            radial-gradient(2px 2px at 65% 85%, #b7a4ff 50%, transparent),
            radial-gradient(1px 1px at 45% 10%, #ffffff 50%, transparent),
            radial-gradient(1px 1px at 30% 35%, #a4c8ff 50%, transparent);
          background-size: 100% 100%;
          animation: galaxyTwinkle 5s ease-in-out infinite alternate;
        }
        .sp-dashboard::after {
          content: "";
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 20% 50%, #6240ff12, transparent 45%),
            radial-gradient(ellipse at 80% 35%, #00d9ff0d, transparent 42%);
        }
        .sp-dashboard * { box-sizing: border-box; }
        .sp-topbar {
          min-height: 82px; display: flex; align-items: center;
          justify-content: space-between; gap: 20px; padding: 16px 4%;
          border-bottom: 1px solid #ffffff12; background: #080619b8;
          position: relative; z-index: 5; backdrop-filter: blur(18px);
        }
        .sp-brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:white; font-weight:800; white-space:nowrap; }
        .sp-brand-icon { display:grid; place-items:center; width:44px;height:44px;border-radius:15px;background:linear-gradient(135deg,#a78bfa,#6244ef);box-shadow:0 0 28px #8855ff55;font-size:23px; }
        .sp-search { width:min(48%,520px);border:1px solid #ffffff18;border-radius:30px;background:#ffffff0b;padding:14px 20px;color:white;outline:none; }
        .sp-search:focus { border-color:#9b80ff; }
        .sp-avatar { width:43px;height:43px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#edb8ff,#7167ff);font-size:21px; }
        .sp-top-actions { display:flex;align-items:center;gap:18px; }
        .sp-icon-button { border:0;background:transparent;color:white;font-size:23px;cursor:pointer; }
        .sp-layout { max-width:1600px;margin:auto;padding:12px 18px 0;display:grid;grid-template-columns:minmax(210px, .78fr) minmax(480px, 2.3fr) minmax(210px,.78fr);gap:22px;align-items:center; }
        .sp-side { display:flex;flex-direction:column;gap:22px;min-width:0; }
        .sp-panel { border:1px solid #9d8aff35;border-radius:25px;background:linear-gradient(145deg,#191637ed,#0b0a20f2);padding:23px;box-shadow:0 12px 40px #0004,inset 0 1px #ffffff08; }
        .sp-panel h3 { font-size:17px;margin:0 0 18px;font-weight:750; }
        .sp-muted { color:#aaa6c7;font-size:13px;line-height:1.7; }
        .sp-progress-row { display:flex;align-items:center;gap:15px; }
        .sp-ring { width:105px;height:105px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;background:conic-gradient(#70e6e1 0deg 252deg,#34304e 252deg 360deg);position:relative; }
        .sp-ring:before { content:"";position:absolute;inset:10px;border-radius:50%;background:#13112c; }
        .sp-ring span { position:relative;font-size:22px;font-weight:850; }
        .sp-stat-list { display:grid;gap:13px;margin-top:23px; }
        .sp-stat-line { display:flex;gap:10px;align-items:center;color:#d9d6eb;font-size:13px; }
        .sp-dot { width:10px;height:10px;border-radius:50%;background:#73e5df;box-shadow:0 0 10px #73e5df70; }
        .sp-focus { display:flex;gap:12px;align-items:center;line-height:1.6;font-size:14px; }
        .sp-focus-icon { display:grid;place-items:center;flex-shrink:0;width:42px;height:42px;border-radius:14px;background:#8d70ff22;font-size:22px; }
        .sp-primary { border:0;border-radius:30px;background:linear-gradient(100deg,#7850f5,#6039df);color:white;font-weight:750;padding:13px 18px;cursor:pointer;box-shadow:0 7px 25px #6945ef35;transition:transform .2s,filter .2s; }
        .sp-primary:hover { transform:translateY(-2px);filter:brightness(1.13); }
        .sp-full { width:100%;margin-top:19px; }
        .sp-universe { min-width:0;position:relative;display:grid;place-items:center;aspect-ratio:1 / 1;max-height:740px;isolation:isolate;overflow:visible; }
        .sp-orbit { position:absolute;border:1px solid #9b80ff80;border-radius:50%;pointer-events:none; }
        .sp-orbit-one { width:91%;height:91%;animation:sp-rotate 45s linear infinite;box-shadow:0 0 18px #6b51ff19; }
        .sp-orbit-two { width:68%;height:68%;border-color:#69dffff0;border-style:dashed;opacity:.48;animation:sp-rotate 65s linear infinite reverse;box-shadow:0 0 18px #55cfff18; }
        .sp-orbit-three { width:47%;height:47%;border-color:#e0b2ff80;box-shadow:0 0 35px #7952ff25; }
        .sp-glow { position:absolute;width:56%;aspect-ratio:1;border-radius:50%;background:#673dff36;filter:blur(58px); }
        .sp-core { position:relative;z-index:2;width:40%;aspect-ratio:1;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px;background:radial-gradient(circle at 30% 22%,#d4eaff,transparent 17%),radial-gradient(circle at 35% 28%,#718eff 0%,#3934a0 35%,#171044 72%,#07071c 100%);border:2px solid #b2c7ff;box-shadow:0 0 24px #8b78ffcc,0 0 65px #6648ff70,0 0 120px #356cff35,inset 0 0 38px #8ce9ff50;animation:sp-float 5s ease-in-out infinite; }
        .sp-core:before { content:"";position:absolute;inset:-12px;border:1px solid #7d9bff65;border-radius:50%;animation:sp-rotate 24s linear infinite; }
        .sp-core:after { content:"";position:absolute;inset:8px;border:1px solid #d4d4ff6e;border-radius:50%; }
        .sp-core-symbol { font-size:clamp(30px,5vw,64px);filter:drop-shadow(0 0 12px #ffffff90); }
        .sp-core-title { font-size:clamp(15px,2vw,29px);font-weight:900;letter-spacing:-.7px;margin-top:8px; }
        .sp-core-sub { color:#d2d2ff;font-size:clamp(10px,1vw,14px);margin-top:8px; }
        .sp-node { position:absolute;z-index:3;width:24%;aspect-ratio:1;border-radius:50%;border:1px solid #a99bff72;background:radial-gradient(circle at 35% 20%,#50458a99,transparent 70%),linear-gradient(145deg,#211c4aef,#0b1028f5);backdrop-filter:blur(8px);box-shadow:inset 0 0 22px #8d7bff12,0 0 18px #7a5bff18;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:white;cursor:pointer;transition:transform .25s,border-color .25s,box-shadow .25s; }
        .sp-node:hover { transform:scale(1.08);border-color:#9deaff;box-shadow:0 0 20px #8b67ff75,0 0 45px #6b48ff35,inset 0 0 25px #a895ff30; }
        .sp-node.active { border-color:#9deaff;box-shadow:0 0 20px #8b67ff75,0 0 45px #6b48ff35,inset 0 0 25px #a895ff30;background:linear-gradient(145deg,#4a3a8b,#191438); }
        .sp-node-icon { font-size:clamp(22px,3.2vw,43px);line-height:1.1; }
        .sp-node-label { font-size:clamp(10px,1.15vw,15px);font-weight:750;text-align:center; }
        
/* PERFECT CIRCULAR ORBIT */
.sp-universe {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  min-width: 0;
  max-height: 740px;
  display: grid;
  place-items: center;
  isolation: isolate;
}

.sp-node {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 23%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
}

/* Seven nodes, equal angular spacing */
.sp-node-home {
  left: 50%;
  top: 9%;
}

.sp-node-mentor {
  left: 18%;
  top: 25%;
}

.sp-node-skills {
  left: 82%;
  top: 25%;
}

.sp-node-projects {
  left: 90%;
  top: 59%;
}

.sp-node-certificates {
  left: 10%;
  top: 59%;
}

.sp-node-community {
  left: 29%;
  top: 85%;
}

.sp-node-roadmap {
  left: 71%;
  top: 85%;
}

/* Preserve hover movement while keeping nodes aligned */
.sp-node:hover {
  transform: translate(-50%, -50%) scale(1.05);
}

        .sp-stars { position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,#c7b8ff 1px,transparent 2px),radial-gradient(circle,#6ce8ff 1px,transparent 2px);background-size:89px 97px,137px 143px;background-position:13px 22px,51px 67px;opacity:.28;mask-image:radial-gradient(ellipse,#000 20%,transparent 75%); }
        .sp-mentor-robot { font-size:38px;float:left;margin:0 12px 8px 0; }
        .sp-quick-stat { display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #ffffff0e; }
        .sp-quick-stat:last-child { border-bottom:0;padding-bottom:0; }
        .sp-quick-icon { width:39px;height:39px;display:grid;place-items:center;border-radius:13px;background:#a07aff17;font-size:20px; }
        .sp-quick-number { font-size:20px;font-weight:850; }
        .sp-quick-label { color:#aaa6c7;font-size:12px;margin-top:2px; }
        .sp-bottom { display:none; }
        .sp-section { max-width:1000px;margin:0 auto 32px;padding:28px;border:1px solid #9d8aff35;border-radius:24px;background:linear-gradient(145deg,#191637ed,#0b0a20f2);box-shadow:0 12px 40px #0004; }
        .sp-section h2 { font-size:25px;margin:0 0 10px; }
        .sp-chips { display:flex;flex-wrap:wrap;gap:10px;margin-top:20px; }
        .sp-chip { border:1px solid #ffffff1e;border-radius:14px;background:#ffffff08;padding:11px 15px;color:#e7e1ff;cursor:pointer; }
        .sp-chip.selected { border-color:#a28aff;background:#7654e42c;color:#d5c7ff; }
        .sp-list { display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:15px;margin-top:20px; }
        .sp-project { border:1px solid #ffffff16;border-radius:17px;padding:18px;background:#ffffff05; }
        .sp-project h3 { margin:8px 0;font-size:17px; }
        .sp-project p { color:#aaa6c7;font-size:13px;line-height:1.6; }
        .sp-chat { position:fixed;z-index:50;right:22px;bottom:22px;width:min(390px,calc(100vw - 28px));height:min(540px,75vh);display:flex;flex-direction:column;border:1px solid #a78bfa66;border-radius:22px;background:#100d27;box-shadow:0 20px 80px #000a;overflow:hidden; }
        .sp-chat-head { display:flex;justify-content:space-between;align-items:center;padding:17px;border-bottom:1px solid #ffffff16;font-weight:800; }
        .sp-chat-body { flex:1;overflow:auto;padding:15px;display:flex;flex-direction:column;gap:12px; }
        .sp-bubble { max-width:90%;padding:12px;border-radius:14px;background:#ffffff0c;color:#dedaf1;font-size:13px;line-height:1.6; }
        .sp-bubble.you { align-self:flex-end;background:#6745c7; }
        .sp-chat-form { display:flex;gap:8px;padding:12px;border-top:1px solid #ffffff16; }
        .sp-chat-form input { flex:1;min-width:0;background:#ffffff0a;border:1px solid #ffffff20;border-radius:12px;padding:11px;color:white;outline:none; }
        @keyframes sp-rotate { to { transform:rotate(360deg); } }
        @keyframes sp-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes galaxyTwinkle { from { opacity:0.55; } to { opacity:1; } }
        @media(min-width:1500px) { .sp-layout { grid-template-columns:260px minmax(500px,1fr) 260px; } }
        @media(max-width:1050px) {
          .sp-layout { grid-template-columns:minmax(0,1fr);max-width:800px;gap:24px; }
          .sp-universe { order:0;width:100%;max-height:none; }
          .sp-side { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));order:1; }
          .sp-panel { padding:19px; }
          .sp-ring { width:85px;height:85px; }
          .sp-node { width: 24%;aspect-ratio: 1; }
          .sp-node-label { font-size:clamp(10px,1.7vw,14px); }
          .sp-universe { min-height:0; }
        }
        @media(max-width:560px) {
          .sp-topbar { padding:12px 15px;gap:10px;min-height:70px; }
          .sp-brand { gap:8px;font-size:14px; }
          .sp-brand-icon { width:36px;height:36px;border-radius:12px; }
          .sp-search { position:absolute;top:76px;left:15px;width:calc(100% - 30px);padding:12px 15px; }
          .sp-top-actions { gap:10px; }
          .sp-avatar { width:36px;height:36px; }
          .sp-layout { padding:62px 12px 25px;gap:18px; }
          .sp-universe { width:100%;min-height:0; }
          .sp-node { width:24%;gap:4px; }
          .sp-node-icon { font-size:23px; }
          .sp-node-label { font-size:9px; }
          .sp-core { width:39%; }
          .sp-core-title { font-size:13px; }
          .sp-core-sub { font-size:9px; }
          .sp-side { grid-template-columns:1fr;gap:14px; }
          .sp-panel { padding:20px; }
          .sp-section { margin:0 12px 20px;padding:21px; }
        }


        /* ===== POLISHED DASHBOARD LABELS, SPACING AND ACCESSIBILITY ===== */
        .sp-dashboard button,
        .sp-dashboard input {
          font: inherit;
        }

        .sp-dashboard button:focus-visible,
        .sp-dashboard a:focus-visible,
        .sp-dashboard input:focus-visible {
          outline: 2px solid #8cecff;
          outline-offset: 4px;
        }

        .sp-dashboard .sp-topbar {
          min-height: 78px;
          padding-inline: clamp(16px, 3.8vw, 58px);
        }

        .sp-dashboard .sp-brand-icon {
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .sp-dashboard .sp-brand:hover .sp-brand-icon {
          transform: rotate(-7deg) scale(1.04);
          box-shadow: 0 0 34px #8855ff80;
        }

        .sp-dashboard .sp-search::placeholder {
          color: #aaa5c5;
          opacity: 1;
        }

        .sp-dashboard .sp-search {
          transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }

        .sp-dashboard .sp-search:focus {
          background: #17132d;
          box-shadow: 0 0 0 4px #8e71ff16;
        }

        .sp-dashboard .sp-panel {
          position: relative;
          overflow: hidden;
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
        }

        .sp-dashboard .sp-panel:hover {
          transform: translateY(-2px);
          border-color: #a99aff66;
          box-shadow: 0 16px 42px #0005, 0 0 22px #7557ff10;
        }

        .sp-dashboard .sp-panel h3 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          line-height: 1.35;
          letter-spacing: -.2px;
        }

        .sp-dashboard .sp-muted {
          overflow-wrap: anywhere;
        }

        .sp-dashboard .sp-stat-line {
          min-height: 20px;
        }

        .sp-dashboard .sp-dot {
          flex: 0 0 10px;
        }

        .sp-dashboard .sp-ring {
          box-shadow: 0 0 26px #70e6e118;
        }

        .sp-dashboard .sp-primary {
          min-height: 44px;
          letter-spacing: -.1px;
        }

        .sp-dashboard .sp-primary:active {
          transform: translateY(0) scale(.985);
        }

        .sp-dashboard .sp-node {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .sp-dashboard .sp-node:focus-visible {
          outline: 2px solid #8cecff;
          outline-offset: 5px;
        }

        .sp-dashboard .sp-node-label {
          max-width: 90%;
          line-height: 1.25;
          overflow-wrap: anywhere;
        }

        .sp-dashboard .sp-core-title {
          line-height: 1.15;
        }

        .sp-dashboard .sp-section {
          position: relative;
          overflow: hidden;
          animation: sp-section-enter .35s ease both;
        }

        .sp-dashboard .sp-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 28px;
          right: 28px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #a995ff80, transparent);
          pointer-events: none;
        }

        .sp-dashboard .sp-section h2 {
          letter-spacing: -.6px;
          line-height: 1.25;
        }

        .sp-dashboard .sp-chips {
          align-items: center;
        }

        .sp-dashboard .sp-chip {
          min-height: 40px;
          transition: border-color .18s ease, background .18s ease, transform .18s ease;
        }

        .sp-dashboard .sp-chip:hover {
          transform: translateY(-1px);
          border-color: #a28aff99;
          background: #7654e41c;
        }

        .sp-dashboard .sp-chip.selected {
          box-shadow: inset 0 0 0 1px #a28aff30, 0 0 18px #7654e414;
        }

        .sp-dashboard .sp-project {
          min-width: 0;
          transition: transform .2s ease, border-color .2s ease, background .2s ease;
        }

        .sp-dashboard .sp-project:hover {
          transform: translateY(-3px);
          border-color: #a28aff70;
          background: #ffffff09;
        }

        .sp-dashboard .sp-project h3 {
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .sp-dashboard .sp-project p {
          margin-bottom: 12px;
        }

        .sp-dashboard .sp-project .sp-chips {
          margin-top: 12px;
        }

        .sp-dashboard .sp-quick-stat {
          min-width: 0;
        }

        .sp-dashboard .sp-quick-label {
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .sp-dashboard .sp-chat {
          backdrop-filter: blur(20px);
          animation: sp-chat-enter .22s ease both;
        }

        .sp-dashboard .sp-chat-head {
          min-height: 60px;
        }

        .sp-dashboard .sp-chat-body {
          scrollbar-width: thin;
          scrollbar-color: #6d56b5 #100d27;
        }

        .sp-dashboard .sp-bubble {
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .sp-dashboard .sp-chat-form input:focus {
          border-color: #9b80ff;
          box-shadow: 0 0 0 3px #8e71ff16;
        }

        .sp-dashboard .sp-icon-button {
          width: 40px;
          height: 40px;
          display: inline-grid;
          place-items: center;
          border-radius: 50%;
          transition: background .2s ease, color .2s ease;
        }

        .sp-dashboard .sp-icon-button:hover {
          background: #ffffff12;
          color: #9deaff;
        }

        .sp-dashboard .sp-bottom {
          padding: 18px;
          text-align: center;
          color: #9690b5;
          font-size: 12px;
        }

        @keyframes sp-section-enter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes sp-chat-enter {
          from { opacity: 0; transform: translateY(12px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (min-width: 1051px) {
          .sp-dashboard .sp-layout {
            grid-template-columns: minmax(220px, .78fr) minmax(460px, 2.3fr) minmax(220px, .78fr);
            gap: clamp(14px, 1.4vw, 24px);
          }

          .sp-dashboard .sp-panel {
            padding: clamp(18px, 1.7vw, 25px);
          }

          .sp-dashboard .sp-section {
            width: calc(100% - 36px);
          }
        }

        @media (min-width: 1200px) {
          .sp-dashboard .sp-universe {
            max-width: 760px;
            margin-inline: auto;
          }

          .sp-dashboard .sp-section {
            max-width: 1050px;
          }
        }

        @media (max-width: 1050px) {
          .sp-dashboard .sp-layout {
            align-items: start;
          }

          .sp-dashboard .sp-universe {
            width: min(100%, 720px);
            margin-inline: auto;
          }

          .sp-dashboard .sp-side {
            align-items: stretch;
          }

          .sp-dashboard .sp-section {
            width: calc(100% - 24px);
          }
        }

        @media (max-width: 700px) {
          .sp-dashboard .sp-topbar {
            flex-wrap: wrap;
          }

          .sp-dashboard .sp-search {
            font-size: 13px;
          }

          .sp-dashboard .sp-progress-row {
            gap: 12px;
          }

          .sp-dashboard .sp-panel h3 {
            font-size: 16px;
          }

          .sp-dashboard .sp-section h2 {
            font-size: 22px;
          }

          .sp-dashboard .sp-list {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 420px) {
          .sp-dashboard .sp-brand {
            white-space: normal;
          }

          .sp-dashboard .sp-brand-icon {
            flex: 0 0 36px;
          }

          .sp-dashboard .sp-top-actions {
            gap: 4px;
          }

          .sp-dashboard .sp-node {
            width: 24%;
          }

          .sp-dashboard .sp-node-label {
            font-size: 8px;
          }

          .sp-dashboard .sp-panel {
            border-radius: 20px;
          }

          .sp-dashboard .sp-section {
            padding: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sp-dashboard .sp-panel,
          .sp-dashboard .sp-chip,
          .sp-dashboard .sp-project,
          .sp-dashboard .sp-brand-icon {
            transition: none;
          }

          .sp-dashboard .sp-section,
          .sp-dashboard .sp-chat {
            animation: none;
          }
        }

        @media(prefers-reduced-motion:reduce) {
          .sp-orbit-one,.sp-orbit-two,.sp-core { animation:none; }
          .sp-node,.sp-primary { transition:none; }
        }

        /* FINAL GAP FIX: keep the welcome/content card close to the orbit */
        @media (min-width: 1051px) {
          .sp-layout {
            padding-top: 12px !important;
            padding-bottom: 0 !important;
            gap: 14px !important;
          }
          .sp-section {
            margin-top: -26px !important;
          }
        }
        @media (max-width: 1050px) {
          .sp-layout {
            padding-bottom: 0 !important;
            gap: 16px !important;
          }
          .sp-section {
            margin-top: 0 !important;
          }
        }
        @media (max-width: 560px) {
          .sp-layout {
            padding-bottom: 0 !important;
          }
            
/* ===== SKILL2PROJECT GALAXY ALIGNMENT FIX ===== */

/* Align all dashboard panels from the same top edge */
.sp-dashboard .sp-layout {
  align-items: start !important;
}

/* Keep the galaxy perfectly square and responsive */
.sp-dashboard .sp-universe {
  width: 100%;
  min-width: 0;
  min-height: 0 !important;
  max-height: none;
  aspect-ratio: 1 / 1;
  position: relative;
  display: grid;
  place-items: center;
  overflow: visible;
}

/* Center each orbit button on its coordinate */
.sp-dashboard .sp-node {
  position: absolute;
  width: 22%;
  height: auto;
  aspect-ratio: 1 / 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

/* Top */
.sp-dashboard .sp-node-home {
  left: 50%;
  top: 12%;
}

/* Upper left and upper right */
.sp-dashboard .sp-node-mentor {
  left: 18%;
  top: 28%;
}

.sp-dashboard .sp-node-skills {
  left: 82%;
  top: 28%;
}

/* Middle left and middle right */
.sp-dashboard .sp-node-certificates {
  left: 14%;
  top: 61%;
}

.sp-dashboard .sp-node-projects {
  left: 86%;
  top: 61%;
}

/* Bottom left and bottom right */
.sp-dashboard .sp-node-community {
  left: 29%;
  top: 84%;
}

.sp-dashboard .sp-node-roadmap {
  left: 71%;
  top: 84%;
}

/* Keep hover animation centered */
.sp-dashboard .sp-node:hover {
  transform: translate(-50%, -50%) scale(1.05);
}

/* Consistent galaxy sizing on tablets */
@media (max-width: 1050px) {
  .sp-dashboard .sp-layout {
    align-items: start !important;
  }

  .sp-dashboard .sp-universe {
    width: 100%;
    min-height: 0 !important;
    max-height: none;
    aspect-ratio: 1 / 1;
  }

  .sp-dashboard .sp-node {
    width: 22%;
  }
}

/* Small screens */
@media (max-width: 560px) {
  .sp-dashboard .sp-universe {
    width: 100%;
    min-height: 0 !important;
    aspect-ratio: 1 / 1;
  }

  .sp-dashboard .sp-node {
    width: 23%;
    padding: 3px;
    gap: 4px;
  }

  .sp-dashboard .sp-node-icon {
    font-size: clamp(18px, 5vw, 25px);
  }

  .sp-dashboard .sp-node-label {
    font-size: clamp(8px, 2.2vw, 11px);
  }
        }
      `}
      </style>

      <style>{`
        @media (min-width: 1051px) {
          .sp-dashboard .sp-layout {
            grid-template-columns: minmax(200px, .78fr) minmax(0, 2fr) minmax(200px, .78fr) !important;
            gap: 16px !important;
            align-items: start !important;
          }
          .sp-dashboard .sp-universe {
            width: min(100%, 620px) !important;
            max-height: none !important;
            aspect-ratio: 1 / 1 !important;
            margin-inline: auto !important;
          }
          .sp-dashboard main > .sp-section {
            margin-top: -14px !important;
          }
        }
      `}</style>
      <header className="sp-topbar">
        <Link to="/" className="sp-brand">
          <span className="sp-brand-icon">S</span>
          <span>
            Skill2Project
            <span style={{ display: "block", color: "#a8a1c9", fontSize: 11, fontWeight: 500 }}>
              Turn | Explore | Grow
            </span>
          </span>
        </Link>

        <input
          className="sp-search"
          placeholder="Search projects, skills or ask AI..."
          aria-label="Search dashboard projects"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setActive("projects");
              document.getElementById("sp-projects")?.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
        />

        <div className="sp-top-actions">
          <button
            className="sp-icon-button"
            aria-label="Notifications"
            onClick={() => alert("You're all caught up!")}
          >
            â™§
          </button>
          <div className="sp-avatar" title="Student profile">{"\u{1F464}"}</div>
        </div>
      </header>

      <main>
        <div className="sp-layout">
          {/* LEFT SIDE */}
          <aside className="sp-side">
            <section className="sp-panel">
              <h3>Learning Progress <span style={{ float: "right", color: "#a99aff" }}>{"\u2197"}</span></h3>
              <div className="sp-progress-row">
                <div className="sp-ring"><span>70%</span></div>
                <div className="sp-muted">Keep going!<br />You're growing.</div>
              </div>
              <div className="sp-stat-list">
                <div className="sp-stat-line"><span className="sp-dot" /> {skills.length} Skills Mastered</div>
                <div className="sp-stat-line"><span className="sp-dot" style={{ background: "#e5a8ff" }} /> 5 Currently Learning</div>
                <div className="sp-stat-line"><span className="sp-dot" style={{ background: "#ffcf83" }} /> 3 Projects In Progress</div>
                <div className="sp-stat-line"><span className="sp-dot" style={{ background: "#fa9fc7" }} /> 2 Projects Completed</div>
              </div>
            </section>

            <section className="sp-panel">
              <h3>Today's Learning Goal <span style={{ float: "right", color: "#a99aff" }}>{"\u2728"}</span></h3>
              <div className="sp-focus">
                <span className="sp-focus-icon">{"\u{1F3AF}"}</span>
                <span>Build your next project<br /><strong>Practice daily</strong></span>
              </div>
              <button
                className="sp-primary sp-full"
                onClick={() => openItem("roadmap")}
              >
                View Learning Roadmap
              </button>
            </section>
          </aside>

          {/* CENTER CIRCULAR DASHBOARD */}
          <section className="sp-universe" aria-label="Interactive circular dashboard menu">
            <div className="sp-stars" />
            <div className="sp-glow" />
            <div className="sp-orbit sp-orbit-one" />
            <div className="sp-orbit sp-orbit-two" />
            <div className="sp-orbit sp-orbit-three" />

            <div className="sp-core">
              <span className="sp-core-symbol">🌐</span>
              <span className="sp-core-title">Skill2Project</span>
              <span className="sp-core-sub">Turn | Explore | Grow</span>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`sp-node sp-node-${item.id} ${active === item.id ? "active" : ""}`}
                onClick={() => openItem(item.id)}
                aria-pressed={active === item.id}
                aria-label={item.label}
              >
                <span className="sp-node-icon">{item.icon}</span>
                <span className="sp-node-label">{item.label}</span>
              </button>
            ))}
          </section>

          {/* RIGHT SIDE */}
          <aside className="sp-side">
            <section className="sp-panel">
              <h3>AI Mentor <span style={{ float: "right", color: "#a99aff" }}>{"\u2728"}</span></h3>
              <div style={{ minHeight: 105 }}>
                <span className="sp-mentor-robot">{"\u{1F52E}"}</span>
                <p className="sp-muted">
                  Get guidance on projects, skills, career paths and your next build
                  for your next build.
                </p>
              </div>
              <button
                className="sp-primary sp-full"
                onClick={() => {
                  setChatOpen(true);
                  setActive("mentor");
                }}
              >
                Start Chat {"\u2192"}</button>
            </section>

            <section className="sp-panel">
              <h3>Quick Stats</h3>
              <div className="sp-quick-stat">
                <span className="sp-quick-icon">{"\u{1F4CA}"}</span>
                <div><div className="sp-quick-number">8</div><div className="sp-quick-label">Project Ideas Explored</div></div>
              </div>
              <div className="sp-quick-stat">
                <span className="sp-quick-icon">{"\u{1F4CA}"}</span>
                <div><div className="sp-quick-number">3</div><div className="sp-quick-label">Saved Project Ideas</div></div>
              </div>
              <div className="sp-quick-stat">
                <span className="sp-quick-icon">{"\u{1F4CA}"}</span>
                <div><div className="sp-quick-number">5</div><div className="sp-quick-label">Learning Milestones</div></div>
              </div>
            </section>
          </aside>
        </div>

        {/* INTERACTIVE CONTENT SECTIONS */}
        {active === "skills" && (
          <section className="sp-section" id="sp-skills">
            <h2>âœ¨ My Skills</h2>
            <p className="sp-muted">Choose the technologies you know or want to practise. Your skill count updates instantly.</p>
            <div className="sp-chips">
              {["Python", "Java", "JavaScript", "React", "Flutter", "HTML/CSS", "Django", "SQL", "AI/ML", "UI/UX"].map((skill) => (
                <button
                  key={skill}
                  className={`sp-chip ${skills.includes(skill) ? "selected" : ""}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skills.includes(skill) ? "âœ“ " : "+ "}{skill}
                </button>
              ))}
            </div>
            <p className="sp-muted" style={{ marginTop: 18 }}>Your selected skills: {skills.join(", ") || "None yet"}</p>
          </section>
        )}

        {active === "projects" && (
          <section className="sp-section" id="sp-projects">
            <h2>ðŸš€ Explore Projects</h2>
            <p className="sp-muted">Explore starter projects and choose one that matches your skills and goals.</p>
            <div className="sp-list">
              {[
                { icon: "ðŸ¤–", title: "AI Interview Tracker", desc: "Organize interview questions and preparation.", tags: ["React", "Python"] },
                { icon: "ðŸ’¼", title: "Student Portfolio", desc: "Showcase your skills, projects and achievements.", tags: ["HTML/CSS", "JavaScript"] },
                { icon: "ðŸ“Š", title: "Expense Tracker", desc: "Track expenses and visualize spending.", tags: ["Python", "SQL"] },
                { icon: "ðŸŽ“", title: "Campus Connect", desc: "Build a community app for students.", tags: ["Flutter", "Django"] },
              ].map((project) => (
                <article className="sp-project" key={project.title}>
                  <span style={{ fontSize: 27 }}>{project.icon}</span>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  <div className="sp-chips">
                    {project.tags.map((tag) => <span className="sp-chip" key={tag}>{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === "certificates" && (
          <section className="sp-section">
            <h2>ðŸ† Certificates & Learning Milestones</h2>
            <p className="sp-muted">Track your learning achievements here. Add your actual certificates as you earn them.</p>
            <div className="sp-list">
              <article className="sp-project"><h3>ðŸŒ± Learning Starter</h3><p>Start learning a new technology and record your progress.</p></article>
              <article className="sp-project"><h3>ðŸš€ Project Builder</h3><p>Complete your first project and add it to your portfolio.</p></article>
            </div>
          </section>
        )}

        {active === "community" && (
          <section className="sp-section">
            <h2>ðŸ‘¥ Student Community</h2>
            <p className="sp-muted">Share ideas, collaborate on projects and learn from fellow students.</p>
            <Link className="sp-primary" style={{ display: "inline-block", textDecoration: "none", marginTop: 15 }} to="/explore-projects">Find Project Ideas â†’</Link>
          </section>
        )}

        {active === "roadmap" && (
          <section className="sp-section">
            <h2>ðŸ“ˆ Your Learning Roadmap</h2>
            <p className="sp-muted">Follow these milestones to turn your skills into a finished, portfolio-ready project.</p>
            {["Choose your skills and goal", "Learn the tools you need", "Build a small prototype", "Test and improve your project", "Publish it in your portfolio"].map((step, index) => (
              <div className="sp-quick-stat" key={step}>
                <span className="sp-quick-icon">{"\u{1F4CA}"}</span>
                <div><div style={{ fontWeight: 700 }}>{step}</div><div className="sp-quick-label">Learning milestone</div></div>
              </div>
            ))}
          </section>
        )}

        {active === "home" && (
          <section className="sp-section">
            <h2>{"\u{1F31F}"} Welcome to Your Learning Journey</h2>
            <p className="sp-muted">Choose a section above to manage your skills, discover project ideas and track your learning journey.</p>
          </section>
        )}
      </main>

      {chatOpen && (
        <section className="sp-chat" aria-label="AI Mentor chat">
          <div className="sp-chat-head">
            <span>ðŸ¤– AI Mentor <span style={{ color: "#aaa6c7", fontSize: 11 }}>Â· Demo</span></span>
            <button className="sp-icon-button" onClick={() => setChatOpen(false)} aria-label="Close chat">Ã—</button>
          </div>
          <div className="sp-chat-body">
            {messages.map((item, index) => (
              <div key={index} className={`sp-bubble ${item.from === "You" ? "you" : ""}`}>
                {item.from !== "You" && <strong>{item.from}<br /></strong>}
                {item.text}
              </div>
            ))}
          </div>
          <form className="sp-chat-form" onSubmit={sendMessage}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about skills, projects or career paths..."
              aria-label="Message AI Mentor"
            />
            <button className="sp-primary" type="submit">Send</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Dashboard;




