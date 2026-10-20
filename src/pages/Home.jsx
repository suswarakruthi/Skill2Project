import { Link } from "react-router-dom";

const features = [
  {
    icon: "🧠",
    title: "AI Skill Matching",
    description:
      "Discover projects that match your skills, interests and learning goals.",
  },
  {
    icon: "🚀",
    title: "Build Real Projects",
    description:
      "Turn your knowledge into practical projects that strengthen your portfolio.",
  },
  {
    icon: "📈",
    title: "Track Your Growth",
    description:
      "Keep track of your skills, project journey and learning progress.",
  },
];

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#080619] text-white">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl font-black shadow-lg shadow-violet-500/30">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">
            Skill<span className="text-violet-400">2</span>Project
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link to="/" className="transition hover:text-violet-400">
            Home
          </Link>
          <Link to="/about" className="transition hover:text-violet-400">
            About
          </Link>
          <Link
            to="/how-it-works"
            className="transition hover:text-violet-400"
          >
            How It Works
          </Link>
          <Link
            to="/explore-projects"
            className="transition hover:text-violet-400"
          >
            Explore Projects
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:text-violet-400 sm:block"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 md:grid-cols-2 md:pb-32 md:pt-24">
          <div className="pointer-events-none absolute left-0 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Your skills. Your ideas. Your future.
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Turn Your Skills Into{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                Real Projects.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Stop wondering what to build next. Discover project ideas
              tailored to your skills, explore new technologies and turn
              your learning into real-world experience.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-4 font-bold shadow-xl shadow-violet-600/25 transition hover:-translate-y-1 hover:bg-violet-500"
              >
                Start Your Journey
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/explore-projects"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 font-semibold transition hover:border-violet-400/50 hover:bg-white/[0.08]"
              >
                Explore Projects
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
              <span>✓ Beginner friendly</span>
              <span>✓ Learn by building</span>
              <span>✓ Portfolio focused</span>
            </div>
          </div>

          {/* Project preview card */}
          <div className="relative z-10 mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#100d27]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    YOUR PROJECT SPACE
                  </p>
                  <h2 className="mt-2 text-xl font-bold">
                    Skill Match Preview
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl">
                  ✨
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-500/[0.07] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">
                      Suggested project
                    </p>
                    <h3 className="mt-2 text-lg font-bold">
                      AI Interview Tracker
                    </h3>
                  </div>
                  <span className="rounded-lg bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300">
                    Demo
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["React", "Python", "APIs", "AI"].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">
                      Skill compatibility
                    </span>
                    <span className="font-bold text-violet-300">
                      Preview
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <span className="text-2xl">🎯</span>
                  <p className="mt-3 font-semibold">Smart Discovery</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Find your next build
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <span className="text-2xl">⚡</span>
                  <p className="mt-3 font-semibold">Keep Growing</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Learn through projects
                  </p>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">
                Illustrative preview · Recommendations are not live yet
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/[0.07] bg-white/[0.015] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-400">
                Built for student innovators
              </p>
              <h2 className="mt-4 text-3xl font-black sm:text-5xl">
                Everything you need to{" "}
                <span className="text-violet-400">start building.</span>
              </h2>
              <p className="mt-5 leading-7 text-slate-400">
                Move beyond tutorials. Use what you know, discover what
                you can create and grow one project at a time.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-white/[0.08] bg-[#100d27]/70 p-7 transition duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-950/30"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl transition group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <p className="mt-5 text-sm text-violet-300">
                    FEATURE 0{index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-[#15102e] to-cyan-500/10 px-6 py-14 text-center sm:px-12 sm:py-16">
            <h2 className="text-3xl font-black sm:text-5xl">
              Your next big idea starts here.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
              Take the first step. Discover projects, challenge yourself
              and turn your skills into something real.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-7 py-4 font-bold transition hover:-translate-y-1 hover:bg-violet-500"
            >
              Create Your Account <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-bold">
            Skill<span className="text-violet-400">2</span>Project
          </p>
          <p className="text-sm text-slate-500">
            Build skills. Create projects. Shape your future.
          </p>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Skill2Project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;