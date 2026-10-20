import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import FeaturePage from "../pages/FeaturePage";
import Mentor from "../pages/Mentor";
import ExploreProjects from "../pages/ExploreProjects";
import Skills from "../pages/Skills";
import Profile from "../pages/Profile";
import PortfolioPreview from "../pages/PortfolioPreview";
import Certificates from "../pages/Certificates";
import Community from "../pages/Community";
import Roadmap from "../pages/Roadmap";
import MyGoals from "../pages/MyGoals";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/portfolio-preview" element={<PortfolioPreview />} />
      <Route path="/mentor" element={<Mentor />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/projects" element={<ExploreProjects />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/community" element={<Community />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/goals" element={<MyGoals />} />
    </Routes>
  );
}

export default AppRoutes;





