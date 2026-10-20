import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import FeaturePage from "../pages/FeaturePage";
import ExploreProjects from "../pages/ExploreProjects";
import Skills from "../pages/Skills";
import Profile from "../pages/Profile";
import PortfolioPreview from "../pages/PortfolioPreview";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/portfolio-preview" element={<PortfolioPreview />} />
      <Route path="/mentor" element={<FeaturePage />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/projects" element={<ExploreProjects />} />
      <Route path="/certificates" element={<FeaturePage />} />
      <Route path="/community" element={<FeaturePage />} />
      <Route path="/roadmap" element={<FeaturePage />} />
    </Routes>
  );
}

export default AppRoutes;


