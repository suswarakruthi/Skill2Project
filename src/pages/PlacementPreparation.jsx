import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const STORAGE_KEY = "skill2project-placement-prep";

const initialTasks = [
  { id: 1, section: "Java & DSA", title: "Revise Java variables, data types and loops", done: false },
  { id: 2, section: "Java & DSA", title: "Practice arrays and strings", done: false },
  { id: 3, section: "Java & DSA", title: "Learn searching and sorting", done: false },
  { id: 4, section: "Java & DSA", title: "Solve two beginner coding problems", done: false },
  { id: 5, section: "Core Subjects", title: "Revise OOPs concepts", done: false },
  { id: 6, section: "Core Subjects", title: "Study DBMS and SQL basics", done: false },
  { id: 7, section: "Core Subjects", title: "Learn Operating Systems basics", done: false },
  { id: 8, section: "Interview Skills", title: "Practice introducing yourself", done: false },
  { id: 9, section: "Interview Skills", title: "Explain one project from your resume", done: false },
  { id: 10, section: "Aptitude", title: "Practice percentages and ratios", done: false },
  { id: 11, section: "Aptitude", title: "Practice logical reasoning", done: false },
  { id: 12, section: "Aptitude", title: "Complete the beginner quiz", done: false },
];

const questions = [
  {
    topic: "Java",
    question: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "instance"],
    answer: 1,
    explanation: "The extends keyword lets a class inherit from another class."
  },
  {
    topic: "OOPs",
    question: "Which OOP concept allows the same method name to behave differently?",
    options: ["Encapsulation", "Abstraction", "Polymorphism", "Inheritance only"],
    answer: 2,
    explanation: "Polymorphism allows one interface or method name to have different implementations."
  },
  {
    topic: "DBMS",
    question: "Which SQL command retrieves data from a table?",
    options: ["GET", "OPEN", "SELECT", "FETCH TABLE"],
    answer: 2,
    explanation: "SELECT retrieves rows and columns from database tables."
  },
  {
    topic: "Aptitude",
    question: "What is 20% of 250?",
    options: ["25", "40", "50", "60"],
    answer: 2,
    explanation: "20/100 × 250 = 50."
  },
  {
    topic: "Aptitude",
    question: "A product costs ₹800. Its price increases by 10%. What is the new price?",
    options: ["₹810", "₹880", "₹900", "₹820"],
    answer: 1,
    explanation: "10% of 800 is 80. New price = ₹800 + ₹80 = ₹880."
  },
  {
    topic: "DSA",
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: 1,
    explanation: "A queue follows First In, First Out."
  },
];

const interviews = [
  {
    topic: "Java",
    question: "What is the difference between JDK, JRE and JVM?",
    answer: "JVM executes Java bytecode. JRE provides the JVM and runtime libraries. JDK includes development tools such as the compiler along with runtime components."
  },
  {
    topic: "OOPs",
    question: "What are the four main OOP principles?",
    answer: "Encapsulation, Abstraction, Inheritance and Polymorphism."
  },
  {
    topic: "DBMS",
    question: "What is a primary key?",
    answer: "A primary key uniquely identifies each row in a table. It must be unique and cannot contain NULL values."
  },
  {
    topic: "OS",
    question: "What is the difference between a process and a thread?",
    answer: "A process is an executing program with its own resources. Threads are execution units within a process and generally share that process's memory."
  },
  {
    topic: "SQL",
    question: "What is the difference between WHERE and HAVING?",
    answer: "WHERE filters rows before grouping. HAVING filters groups after GROUP BY."
  },
  {
    topic: "HR",
    question: "How should you answer 'Tell me about yourself'?",
    answer: "Briefly introduce your education, strongest technical skills, a project or achievement, and the type of role you want. Practise a clear 60–90 second answer."
  },
];

const weeklyPlan = [
  { week: "Week 1", title: "Java Fundamentals", details: "Variables, loops, methods, arrays, strings and basic programs." },
  { week: "Week 2", title: "DSA Foundations", details: "Searching, sorting, time complexity, stacks, queues and linked lists." },
  { week: "Week 3", title: "Core CS Subjects", details: "OOPs, DBMS, SQL, Operating Systems and networking basics." },
  { week: "Week 4", title: "Placement Practice", details: "Aptitude, interview questions, mock tests and resume project explanation." },
];

const tabs = [
  { id: "overview", label: "Overview", icon: "✦" },
  { id: "dsa", label: "Java & DSA", icon: "💻" },
  { id: "interview", label: "Interview", icon: "🎤" },
  { id: "aptitude", label: "Aptitude Quiz", icon: "🧠" },
  { id: "plan", label: "Study Plan", icon: "📅" },
];

const cardStyle = {
  background: "linear-gradient(145deg,#171331,#100c25)",
  border: "1px solid #514078",
  borderRadius: 18,
  padding: 20,
};

const muted = { color: "#b8b1d1", lineHeight: 1.7 };
const primaryButton = {
  background: "linear-gradient(100deg,#8050f5,#5935dc)",
  color: "white",
  border: 0,
  borderRadius: 10,
  padding: "11px 16px",
  cursor: "pointer",
  fontWeight: 600,
};

export default function PlacementPreparation() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLanguage, setSelectedLanguage] = useState("Java");
  const [openedAnswers, setOpenedAnswers] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [progressLoaded, setProgressLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        const user = sessionData.session?.user;

        if (!user) {
          if (active) setProgressLoaded(true);
          return;
        }

        if (active) setCurrentUserId(user.id);

        const { data, error } = await supabase
          .from("placement_preparation")
          .select("progress")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.progress?.tasks && active) {
          setTasks(data.progress.tasks);
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          const localTasks = saved ? JSON.parse(saved) : initialTasks;

          const { error: saveError } = await supabase
            .from("placement_preparation")
            .upsert({
              user_id: user.id,
              progress: { tasks: localTasks },
              updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });

          if (saveError) throw saveError;
        }
      } catch (error) {
        console.error("Placement progress load failed:", error.message);
      } finally {
        if (active) setProgressLoaded(true);
      }
    }

    loadProgress();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    if (!progressLoaded || !currentUserId) return;

    const saveProgress = async () => {
      const { error } = await supabase
        .from("placement_preparation")
        .upsert({
          user_id: currentUserId,
          progress: { tasks },
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) console.error("Placement progress save failed:", error.message);
    };

    saveProgress();
  }, [tasks, progressLoaded, currentUserId]);

  const completed = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const quizScore = questions.filter((q, i) => answers[i] === q.answer).length;

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) => task.id === id ? { ...task, done: !task.done } : task)
    );
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const heading = (title, subtitle) => (
    <div style={{ margin: "26px 0 16px" }}>
      <h2 style={{ marginBottom: 6 }}>{title}</h2>
      <p style={{ ...muted, margin: 0 }}>{subtitle}</p>
    </div>
  );

  const taskList = (section) => (
    <div style={{ display: "grid", gap: 10 }}>
      {tasks.filter((task) => task.section === section).map((task) => (
        <label key={task.id} style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: 15, borderRadius: 12, border: "1px solid #ffffff12",
          background: "#ffffff05", cursor: "pointer", lineHeight: 1.6
        }}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
            style={{ width: 18, height: 18, marginTop: 3, accentColor: "#9b7aff", flexShrink: 0 }}
          />
          <span style={{
            flex: 1,
            color: task.done ? "#8f87a8" : "#f7f3ff",
            textDecoration: task.done ? "line-through" : "none"
          }}>{task.title}</span>
          {task.done && <span>✓</span>}
        </label>
      ))}
    </div>
  );

  return (
    <main style={{
      minHeight: "100vh", padding: "clamp(16px,4vw,36px)",
      color: "#f7f3ff",
      background: "radial-gradient(ellipse at top,#29205c,#0b081a 65%)",
      fontFamily: "Inter,system-ui,sans-serif"
    }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => { window.location.href = "/dashboard"; }}
          style={{
            background: "transparent", color: "#c4a6ff",
            border: "1px solid #7557bc", borderRadius: 10,
            padding: "10px 16px", cursor: "pointer", fontWeight: 600
          }}
        >← Back to Dashboard</button>

        <p style={{ color: "#b8a2ff", letterSpacing: 2, fontSize: 12, marginTop: 28 }}>
          SKILL2PROJECT / CAREER GROWTH
        </p>
        <h1 style={{ fontSize: "clamp(30px,5vw,44px)", margin: "0 0 8px" }}>
          Placement Preparation 🚀
        </h1>
        <p style={muted}>Start with the basics. Build consistency. Become interview-ready one step at a time.</p>

        <section style={{ ...cardStyle, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={{ color: "#b8b1d1", margin: "0 0 7px", fontSize: 12, letterSpacing: 1 }}>YOUR LEARNING PROGRESS</p>
              <h2 style={{ margin: 0 }}>{completed} / {tasks.length} tasks completed</h2>
            </div>
            <strong style={{ color: "#6ce8d5", fontSize: 30 }}>{progress}%</strong>
          </div>
          <div style={{ height: 10, background: "#30284b", borderRadius: 20, overflow: "hidden", marginTop: 18 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#8956ff,#55e4e1)", transition: "width .25s" }} />
          </div>
          <p style={{ ...muted, fontSize: 12, marginBottom: 0 }}>Your checklist is saved automatically in this browser.</p>
        </section>

        <section style={{ marginTop: 22, padding: 20, borderRadius: 18, background: "linear-gradient(145deg,#171331,#100c25)", border: "1px solid #514078" }}>
          <h2 style={{ marginTop: 0 }}>Choose Your Programming Language</h2>
          <p style={{ color: "#b8b1d1" }}>Select a language to view its beginner learning topics.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Java", "Python", "C", "C++", "JavaScript"].map((language) => (
              <button key={language} type="button" onClick={() => setSelectedLanguage(language)} style={{
                padding: "11px 17px", borderRadius: 10, cursor: "pointer",
                border: selectedLanguage === language ? "1px solid #a58aff" : "1px solid #514078",
                background: selectedLanguage === language ? "#382565" : "#0c0920",
                color: "#f7f3ff", fontWeight: 600
              }}>{language}</button>
            ))}
          </div>
          <h3 style={{ marginTop: 22 }}>{selectedLanguage} — Beginner Roadmap</h3>
          <ol style={{ color: "#d8d0f2", lineHeight: 2 }}>
            {( {
              "Java": ["Variables, data types and operators", "Conditions, loops and methods", "Arrays and strings", "OOP: classes, inheritance and polymorphism", "Collections and exception handling", "DSA: searching, sorting, stacks and queues"],
              "Python": ["Variables, data types and operators", "Conditions, loops and functions", "Lists, tuples, sets and dictionaries", "Strings and file handling", "Classes and exception handling", "DSA: searching, sorting, stacks and queues"],
              "C": ["Variables, data types and operators", "Conditions, loops and functions", "Arrays and strings", "Pointers and memory basics", "Structures and dynamic memory", "DSA: linked lists, stacks, queues and sorting"],
              "C++": ["Variables, conditions and loops", "Functions, arrays and strings", "Pointers, references and classes", "OOP and constructors", "STL: vector, map, set and queue", "DSA: searching, sorting, trees and graphs"],
              "JavaScript": ["Variables, let, const and data types", "Conditions, loops and functions", "Arrays and objects", "Array methods and strings", "DOM, events and async basics", "DSA: searching, sorting, stacks and queues"]
            }[selectedLanguage] || [])
            .map((topic) => <li key={topic}>{topic}</li>)}
          </ol>
        </section>
        <nav aria-label="Placement preparation sections" style={{
          display: "flex", flexWrap: "wrap", gap: 9, marginTop: 22,
          paddingBottom: 5
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "11px 14px", borderRadius: 11, cursor: "pointer",
                border: activeTab === tab.id ? "1px solid #a58aff" : "1px solid #514078",
                background: activeTab === tab.id ? "#382565" : "#171331",
                color: activeTab === tab.id ? "#ffffff" : "#c5bddf",
                fontWeight: 600
              }}
            >{tab.icon} {tab.label}</button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <>
            {heading("Your preparation hub", "A beginner-friendly path for Java placements.")}

            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(205px,1fr))", gap: 14 }}>
              {[
                { icon: "💻", title: "Java & DSA", detail: "Learn coding fundamentals and solve problems.", tab: "dsa" },
                { icon: "🎤", title: "Interview Questions", detail: "Study common technical and HR questions.", tab: "interview" },
                { icon: "🧠", title: "Aptitude Quiz", detail: "Practise with multiple-choice questions.", tab: "aptitude" },
                { icon: "📅", title: "4-Week Study Plan", detail: "Follow a structured beginner roadmap.", tab: "plan" },
              ].map((item) => (
                <button key={item.title} type="button" onClick={() => setActiveTab(item.tab)} style={{
                  ...cardStyle, color: "#f7f3ff", textAlign: "left", cursor: "pointer"
                }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p style={{ ...muted, fontSize: 14 }}>{item.detail}</p>
                  <span style={{ color: "#c4a6ff", fontSize: 13 }}>Open section →</span>
                </button>
              ))}
            </section>

            {heading("Today's checklist", "Choose manageable tasks and mark them complete as you learn.")}
            <section style={cardStyle}>{taskList("Java & DSA")}</section>
            <section style={{ ...cardStyle, marginTop: 14 }}>{taskList("Core Subjects")}</section>
            <section style={{ ...cardStyle, marginTop: 14 }}>{taskList("Interview Skills")}</section>
            <section style={{ ...cardStyle, marginTop: 14 }}>{taskList("Aptitude")}</section>
          </>
        )}

        {activeTab === "dsa" && (
          <>
            {heading("Java & DSA Practice 💻", "Learn each topic in order. Focus on understanding before speed.")}
            <section style={cardStyle}>
              <h3>Beginner learning order</h3>
              {[
                ["01", "Java basics", "Variables, data types, conditions, loops and methods."],
                ["02", "Arrays & Strings", "Traversal, searching, reversing and frequency counting."],
                ["03", "Searching & Sorting", "Linear search, binary search, bubble sort and selection sort."],
                ["04", "Data Structures", "Stack, queue, linked list, trees and hash maps."],
                ["05", "Problem Solving", "Two pointers, simple recursion and basic time complexity."],
              ].map(([number, title, detail]) => (
                <div key={number} style={{ display: "flex", gap: 14, padding: "15px 0", borderTop: "1px solid #ffffff12" }}>
                  <strong style={{ color: "#bba3ff" }}>{number}</strong>
                  <div><strong>{title}</strong><p style={{ ...muted, fontSize: 14, marginBottom: 0 }}>{detail}</p></div>
                </div>
              ))}
            </section>
            {heading("Java & DSA checklist", "Mark a topic after practising it yourself.")}
            <section style={cardStyle}>{taskList("Java & DSA")}</section>
          </>
        )}

        {activeTab === "interview" && (
          <>
            {heading("Interview Question Bank 🎤", "Try answering each question aloud before revealing the sample answer.")}
            <section style={{ display: "grid", gap: 12 }}>
              {interviews.map((item, index) => {
                const isOpen = openedAnswers.includes(index);
                return (
                  <article key={item.question} style={cardStyle}>
                    <span style={{ color: "#c4a6ff", fontSize: 12 }}>{item.topic}</span>
                    <h3>{item.question}</h3>
                    {isOpen && <p style={{ ...muted, whiteSpace: "pre-wrap" }}>{item.answer}</p>}
                    <button type="button" style={primaryButton} onClick={() => setOpenedAnswers((old) =>
                      isOpen ? old.filter((n) => n !== index) : [...old, index]
                    )}>{isOpen ? "Hide answer" : "Reveal answer"}</button>
                  </article>
                );
              })}
            </section>
            {heading("Interview practice checklist", "Practise consistently, not just on the day before an interview.")}
            <section style={cardStyle}>{taskList("Interview Skills")}</section>
            <section style={{ ...cardStyle, marginTop: 14 }}>{taskList("Core Subjects")}</section>
          </>
        )}

        {activeTab === "aptitude" && (
          <>
            {heading("Beginner Aptitude & Fundamentals 🧠", "Choose one answer for each question, then submit to see your score and explanations.")}
            <section style={{ ...cardStyle, marginBottom: 14 }}>
              <strong>{Object.keys(answers).length} of {questions.length} answered</strong>
              <div style={{ height: 7, background: "#30284b", borderRadius: 20, overflow: "hidden", marginTop: 12 }}>
                <div style={{ width: `${Object.keys(answers).length / questions.length * 100}%`, height: "100%", background: "#8956ff" }} />
              </div>
            </section>
            {questions.map((q, index) => (
              <section key={q.question} style={{ ...cardStyle, marginBottom: 13 }}>
                <span style={{ color: "#c4a6ff", fontSize: 12 }}>QUESTION {index + 1} · {q.topic}</span>
                <h3>{q.question}</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {q.options.map((option, optionIndex) => {
                    const selected = answers[index] === optionIndex;
                    const correct = submitted && optionIndex === q.answer;
                    const wrong = submitted && selected && optionIndex !== q.answer;
                    return (
                      <button key={option} type="button" disabled={submitted} onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))} style={{
                        textAlign: "left", padding: 12, borderRadius: 10, cursor: submitted ? "default" : "pointer",
                        border: correct ? "1px solid #42c8a5" : wrong ? "1px solid #ff7b93" : selected ? "1px solid #a58aff" : "1px solid #514078",
                        background: correct ? "#153a36" : wrong ? "#431f34" : selected ? "#382565" : "#0c0920",
                        color: "#f7f3ff"
                      }}>{String.fromCharCode(65 + optionIndex)}. {option}</button>
                    );
                  })}
                </div>
                {submitted && <p style={muted}>Explanation: {q.explanation}</p>}
              </section>
            ))}
            {submitted ? (
              <section style={{ ...cardStyle, textAlign: "center" }}>
                <h2>Your score: {quizScore} / {questions.length}</h2>
                <p style={muted}>Review the explanations and try again to improve your score.</p>
                <button type="button" style={primaryButton} onClick={resetQuiz}>Try again</button>
              </section>
            ) : (
              <button type="button" style={primaryButton} disabled={Object.keys(answers).length !== questions.length} onClick={() => {
                setSubmitted(true);
                if (quizScore === questions.length) {
                  setTasks((current) => current.map((task) => task.id === 12 ? { ...task, done: true } : task));
                }
              }}>Submit Quiz</button>
            )}
            <p style={{ ...muted, fontSize: 12 }}>This is a practice quiz, not an official company assessment. Answer all questions to submit.</p>
            {heading("Aptitude practice checklist", "Track the topics you have practised.")}
            <section style={cardStyle}>{taskList("Aptitude")}</section>
          </>
        )}

        {activeTab === "plan" && (
          <>
            {heading("Your 4-Week Study Plan 📅", "A suggested beginner schedule. Adjust the pace to fit your college timetable.")}
            <section style={{ display: "grid", gap: 14 }}>
              {weeklyPlan.map((week) => (
                <article key={week.week} style={cardStyle}>
                  <span style={{ color: "#c4a6ff", fontSize: 12 }}>{week.week.toUpperCase()}</span>
                  <h3>{week.title}</h3>
                  <p style={muted}>{week.details}</p>
                </article>
              ))}
            </section>
            {heading("Daily preparation checklist", "Tick tasks as you complete your learning sessions.")}
            <section style={{ display: "grid", gap: 14 }}>
              {["Java & DSA", "Core Subjects", "Interview Skills", "Aptitude"].map((section) => (
                <article key={section} style={cardStyle}>
                  <h3 style={{ marginTop: 0 }}>{section}</h3>
                  {taskList(section)}
                </article>
              ))}
            </section>
          </>
        )}

        <footer style={{ ...muted, fontSize: 12, marginTop: 30, paddingBottom: 20 }}>
          Skill2Project · Beginner Java Track · Progress is saved locally in this browser. Quiz questions are practice material; company interview patterns may vary.
        </footer>
      </div>
    </main>
  );
}


