import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5">
      <h1 className="text-2xl font-bold text-violet-400">
        Skill2Project
      </h1>

      <div className="flex gap-6 text-white">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/explore-projects">Projects</Link>
      </div>

      <Link
        to="/login"
        className="bg-violet-600 px-5 py-2 rounded-full text-white"
      >
        Login
      </Link>
    </nav>
  );
}

export default Navbar;